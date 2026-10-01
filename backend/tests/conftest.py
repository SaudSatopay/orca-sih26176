"""Shared fixtures.

The demo dataset is keyed by hour of day, so every test runs against a frozen
clock (1 Oct 2026, 14:00 IST) and in DEMO mode. That makes the rehearsed
numbers reproducible at any time of day and on a machine with no network.
"""
from __future__ import annotations

import itertools
import sys
from datetime import datetime
from pathlib import Path

import pytest

BACKEND = Path(__file__).resolve().parents[1]
REPO = BACKEND.parent
if str(BACKEND) not in sys.path:  # also set by pytest.ini; kept for direct runs
    sys.path.insert(0, str(BACKEND))

from app import config  # noqa: E402
from app.data import demo_store  # noqa: E402
import app.main as app_main  # noqa: E402  (imports every module that reads the clock)

FROZEN_NOW = datetime(2026, 10, 1, 14, 0, tzinfo=demo_store.IST)

_session_ids = itertools.count(1)


@pytest.fixture(autouse=True)
def frozen_demo_world(monkeypatch):
    """Freeze `now_ist` everywhere it was imported and pin DEMO mode."""
    def fake_now() -> datetime:
        return FROZEN_NOW

    for name, module in list(sys.modules.items()):
        if name.startswith("app.") and hasattr(module, "now_ist"):
            monkeypatch.setattr(module, "now_ist", fake_now)
    previous = config.get_data_mode()
    config.set_data_mode("DEMO")
    yield
    config.set_data_mode(previous)


@pytest.fixture
def session_id() -> str:
    """A chat session nobody else has used, so no context leaks between tests."""
    return f"pytest-{next(_session_ids)}"


@pytest.fixture
def ask(session_id):
    """Run one question through the full agent graph."""
    from app.agents import planner
    from app.schemas import ChatRequest

    def _ask(message: str, **kwargs):
        kwargs.setdefault("session_id", session_id)
        return planner.handle(ChatRequest(message=message, **kwargs))

    return _ask


@pytest.fixture
def client():
    from fastapi.testclient import TestClient

    return TestClient(app_main.app)
