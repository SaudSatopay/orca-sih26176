"""The HTTP surface, through FastAPI's TestClient (no server, no network)."""
from __future__ import annotations

KOCHI = {"lat": 9.9312, "lon": 76.2673}
GOA = {"lat": 15.4909, "lon": 73.8278}


def test_health(client):
    body = client.get("/api/health").json()
    assert body["status"] == "ok"
    assert body["data_mode"] == "DEMO"
    assert len(body["agents"]) == 10


def test_scenarios_lists_the_five_rehearsed_demos(client):
    res = client.get("/api/scenarios")
    assert res.status_code == 200
    body = res.json()
    assert [s["id"] for s in body["scenarios"]] == ["safe", "dangerous", "cyclone", "pfz", "route"]
    for s in body["scenarios"]:
        assert s["ask"] and s["location"] and s["expect"]
    assert body["location_scenarios"]["Mumbai"] == "rough_clearing"


def test_config_exposes_weights_and_floors(client):
    res = client.get("/api/config")
    assert res.status_code == 200
    body = res.json()
    assert body["data_mode"] == "DEMO"
    assert abs(sum(body["risk_weights"].values()) - 1.0) < 1e-9
    floors = body["deterministic_overrides"]
    assert floors["severe_warning_floor"] == 92
    assert floors["fishermen_warning_floor"] == 70
    assert floors["restricted_zone_floor"] == 60
    assert "SIMULATED" in body["sources"]["DEMO"]


def test_fishing_outlook_shape_and_ranking(client):
    res = client.get("/api/fishing", params=KOCHI)
    assert res.status_code == 200
    body = res.json()
    assert body["mode"] == "DEMO"
    assert body["location"]["name"] == "Kochi"
    assert body["safety"]["category"] in ("LOW", "MODERATE", "HIGH", "EXTREME")

    areas = body["areas"]
    assert areas, "Kochi is the rehearsed good-fishing coast"
    assert [a["rank"] for a in areas] == list(range(1, len(areas) + 1))
    chances = [a["probability"] for a in areas]
    assert chances == sorted(chances, reverse=True)
    for a in areas:
        assert 0 <= a["probability"] <= 100
        assert a["confidence"] == round(a["probability"] / 100.0, 2)
        assert a["distance_km"] <= body["radius_km"]
        assert a["rating"] in ("very_good", "good", "fair", "poor")
    assert sum(1 for a in areas if a["recommended"]) == 1

    assert len(body["forecast"]) == 3
    assert body["advice"] and all(isinstance(line, str) for line in body["advice"])
    assert "never a guarantee" in body["method"]


def test_fishing_advice_is_translated(client):
    en = client.get("/api/fishing", params={**GOA, "lang": "en"}).json()["advice"]
    mr = client.get("/api/fishing", params={**GOA, "lang": "mr"}).json()["advice"]
    hi = client.get("/api/fishing", params={**GOA, "lang": "hi"}).json()["advice"]
    assert len(en) == len(mr) == len(hi)
    assert en[0] != mr[0] != hi[0]


def test_fishing_rejects_bad_input(client):
    assert client.get("/api/fishing").status_code == 422
    assert client.get("/api/fishing", params={**KOCHI, "lang": "fr"}).status_code == 422
    assert client.get("/api/fishing", params={**KOCHI, "radius_km": 500}).status_code == 422


def test_chat_returns_the_rehearsed_goa_verdict(client, session_id):
    res = client.post("/api/chat", json={
        "message": "Is it safe to go fishing tomorrow morning near Goa?",
        "session_id": session_id,
    })
    assert res.status_code == 200
    body = res.json()
    assert body["language"] == "en"
    assert body["risk"]["score"] == 9
    assert body["risk"]["category"] == "LOW"
    assert body["answer"].startswith("Conditions look safe")
    assert body["disclaimer"]
    assert body["evidence"] and body["trace"] and body["suggestions"]
    assert body["mode"] == "DEMO"


def test_chat_keeps_context_per_session_and_reset_clears_it(client, session_id):
    ask = "मी उद्या सकाळी ६ वाजता मुंबईजवळ मासेमारीला जाऊ शकतो का?"
    first = client.post("/api/chat", json={"message": ask, "session_id": session_id}).json()
    assert (first["risk"]["score"], first["risk"]["category"]) == (70, "HIGH")

    follow = client.post("/api/chat", json={"message": "दुपारी १२ वाजता काय?",
                                            "session_id": session_id}).json()
    assert follow["intent"]["location_text"] == "Mumbai"
    assert (follow["risk"]["score"], follow["risk"]["category"]) == (37, "MODERATE")

    assert client.post("/api/chat/reset", params={"session_id": session_id}).json()["ok"] is True
    from app.agents import planner
    assert session_id not in planner._SESSIONS


def test_chat_requires_a_message(client):
    assert client.post("/api/chat", json={}).status_code == 422
