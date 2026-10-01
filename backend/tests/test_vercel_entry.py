"""The Vercel function entry point and its config (S3). Nothing is deployed here."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]


@pytest.fixture(scope="module")
def entry():
    spec = importlib.util.spec_from_file_location("orca_vercel_entry", REPO / "api" / "index.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_entry_exposes_the_fastapi_app(entry):
    from fastapi import FastAPI

    assert isinstance(entry.app, FastAPI)


def test_api_routes_answer_through_the_entry(entry):
    from fastapi.testclient import TestClient

    client = TestClient(entry.app)
    res = client.get("/api/scenarios")
    assert res.status_code == 200
    assert len(res.json()["scenarios"]) == 5
    assert client.get("/api/health").json()["data_mode"] == "DEMO"


def test_vercel_config_routes_api_to_the_function_and_everything_else_to_the_spa():
    cfg = json.loads((REPO / "vercel.json").read_text(encoding="utf-8"))
    assert cfg["outputDirectory"] == "frontend/dist"
    assert "npm run build" in cfg["buildCommand"]
    assert "api/index.py" in cfg["functions"]

    rewrites = cfg["rewrites"]
    assert rewrites[0] == {"source": "/api/(.*)", "destination": "/api/index"}
    assert rewrites[-1]["destination"] == "/index.html"
    # The SPA fallback must not swallow API paths.
    assert "api" in rewrites[-1]["source"]


def test_function_requirements_match_the_backend_runtime_deps():
    def names(path):
        lines = (REPO / path).read_text(encoding="utf-8").splitlines()
        return {line.split(">=")[0].split("==")[0].split("[")[0].strip().lower()
                for line in lines if line.strip() and not line.lstrip().startswith("#")}

    assert names("requirements.txt") == names("backend/requirements.txt")
