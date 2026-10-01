"""Vercel entry point: the whole ORCA API as one Python function.

Vercel's Python runtime loads the top-level ASGI variable `app` from a file in
/api. vercel.json rewrites every /api/* request to this function; the request
keeps its original path, which is what the FastAPI routers expect (they are
all mounted under /api/...).

The static frontend is built into frontend/dist and served by Vercel's CDN,
not by this function. frontend/ is excluded from the function bundle, so
backend/app/main.py finds no dist directory and skips its static mounts.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

# The preview runs on cached demo data unless the project's environment says
# otherwise. Must be set before app.config is imported.
os.environ.setdefault("ORCA_DATA_MODE", "DEMO")

from app.main import app  # noqa: E402

__all__ = ["app"]
