"""ORCA API entrypoint.

    uvicorn app.main:app --reload --port 8000
"""
from __future__ import annotations

import mimetypes
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from . import __version__
from .api import alerts, chat, field, fishing, forecast, map as map_api, routes
from .config import get_data_mode

app = FastAPI(
    title="ORCA — Marine EcOsystem Reasoning with Collaborative Agents",
    description=(
        "SIH26176 · A crew of cooperating AI agents that turns Indian marine data "
        "into one safe, explainable decision for fishers.\n\n"
        "**Safety note:** ORCA is decision support. It does not replace official "
        "IMD / INCOIS advisories or Coast Guard instructions."
    ),
    version=__version__,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # hackathon demo; lock down per-origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The JS bundle and the JSON payloads compress to roughly a third; on a phone
# over a coastal 3G link that is the difference between a 2 s and a 5 s paint.
# Starlette skips bodies under `minimum_size` and already-compressed types.
app.add_middleware(GZipMiddleware, minimum_size=500)

app.include_router(chat.router)
app.include_router(fishing.router)
app.include_router(forecast.router)
app.include_router(map_api.router)
app.include_router(alerts.router)
app.include_router(routes.router)
app.include_router(field.router)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "version": __version__, "data_mode": get_data_mode(),
            "agents": ["intent", "planner", "weather", "ocean", "pfz", "cyclone",
                       "gis", "risk", "route", "explanation"]}


# --- serve the built frontend if it exists --------------------------------
_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"

# The built frontend's file types, fixed here rather than read from the
# machine: on Windows, Python takes them from the registry, where `.js` can
# be text/plain (browsers then refuse to run the app's modules and the page
# stays blank) and `.webp` or `.woff2` can be missing.
for _type, _ext in (
    ("text/javascript", ".js"),
    ("text/javascript", ".mjs"),
    ("text/css", ".css"),
    ("text/html", ".html"),
    ("application/json", ".json"),
    ("application/manifest+json", ".webmanifest"),
    ("image/svg+xml", ".svg"),
    ("image/png", ".png"),
    ("image/webp", ".webp"),
    ("image/x-icon", ".ico"),
    ("font/woff2", ".woff2"),
    ("font/woff", ".woff"),
):
    mimetypes.add_type(_type, _ext)


class _HashedAssets(StaticFiles):
    """Vite writes a content hash into every file name under /assets, so a
    given URL can never change its bytes: cache it for a year, immutable."""

    _IMMUTABLE = "public, max-age=31536000, immutable"

    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        if response.status_code in (200, 206, 304):
            response.headers["Cache-Control"] = self._IMMUTABLE
        return response


if _DIST.is_dir():
    app.mount("/assets", _HashedAssets(directory=_DIST / "assets"), name="assets")

    # index.html must NEVER be cached: a browser tab holding yesterday's HTML
    # keeps loading yesterday's JS bundle, and the demo quietly runs old code
    # (this actually happened — a feature "missing" on stage was a stale tab).
    # The hashed /assets files stay cacheable; only the entry document is not.
    _NO_STORE = {"Cache-Control": "no-store, must-revalidate"}

    @app.get("/")
    def index() -> FileResponse:
        return FileResponse(_DIST / "index.html", headers=_NO_STORE)

    _DIST_ROOT = _DIST.resolve()

    @app.get("/{full_path:path}")
    def spa(full_path: str) -> FileResponse:
        # Only a file that resolves INSIDE the built frontend is ever served.
        # The path arrives decoded, so "..%2F" or "..%5C" climbs like "../";
        # resolving first and checking containment stops it reading the
        # server's own source, or a .env beside it.
        candidate = (_DIST / full_path).resolve()
        if candidate.is_file() and candidate.is_relative_to(_DIST_ROOT):
            # /index.html by name is the same entry document as "/".
            if candidate.name == "index.html":
                return FileResponse(candidate, headers=_NO_STORE)
            return FileResponse(candidate)
        return FileResponse(_DIST / "index.html", headers=_NO_STORE)
else:
    @app.get("/")
    def root() -> dict:
        return {
            "name": "ORCA",
            "problem_statement": "SIH26176",
            "docs": "/docs",
            "health": "/api/health",
            "note": "Frontend not built yet — run `npm install && npm run build` in frontend/.",
        }
