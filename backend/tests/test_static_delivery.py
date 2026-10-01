"""Compression and caching of the built frontend (S1)."""
from __future__ import annotations

from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
DIST = REPO / "frontend" / "dist"
pytestmark = pytest.mark.skipif(not (DIST / "assets").is_dir(),
                                reason="frontend/dist is not built")

IMMUTABLE = "public, max-age=31536000, immutable"
GZIP = {"Accept-Encoding": "gzip"}


def _asset(suffix: str) -> str:
    return next(p.name for p in sorted((DIST / "assets").iterdir()) if p.name.endswith(suffix))


@pytest.mark.parametrize("suffix", [".js", ".css"])
def test_hashed_assets_are_gzipped_and_immutable(client, suffix):
    res = client.get(f"/assets/{_asset(suffix)}", headers=GZIP)
    assert res.status_code == 200
    assert res.headers["content-encoding"] == "gzip"
    assert res.headers["cache-control"] == IMMUTABLE
    assert "accept-encoding" in res.headers["vary"].lower()


def test_fonts_are_immutable_too(client):
    res = client.get(f"/assets/{_asset('.woff2')}")
    assert res.status_code == 200
    assert res.headers["cache-control"] == IMMUTABLE


def test_assets_are_served_plain_to_clients_that_do_not_accept_gzip(client):
    res = client.get(f"/assets/{_asset('.js')}", headers={"Accept-Encoding": "identity"})
    assert res.status_code == 200
    assert "content-encoding" not in res.headers
    assert res.headers["cache-control"] == IMMUTABLE


def test_a_missing_asset_is_a_404_and_is_not_cached_forever(client):
    res = client.get("/assets/nope-12345678.js")
    assert res.status_code == 404
    assert "immutable" not in res.headers.get("cache-control", "")


@pytest.mark.parametrize("path", ["/", "/index.html", "/some/deep/link"])
def test_the_entry_document_is_never_stored(client, path):
    res = client.get(path, headers=GZIP)
    assert res.status_code == 200
    assert "text/html" in res.headers["content-type"]
    assert res.headers["cache-control"] == "no-store, must-revalidate"


def test_api_json_is_compressed_but_not_given_a_long_cache(client):
    res = client.get("/api/fishing", params={"lat": 9.9312, "lon": 76.2673}, headers=GZIP)
    assert res.status_code == 200
    assert res.headers["content-encoding"] == "gzip"
    assert "immutable" not in res.headers.get("cache-control", "")
