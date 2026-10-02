#!/usr/bin/env sh
# ===================================================================
#  ORCA one-command launcher for macOS and Linux.
#  ./run-orca.sh — checks everything, installs what is missing,
#  starts the server and opens the app. Demo mode needs no key and
#  no internet; the frontend build ships in the repo.
# ===================================================================
set -u
cd "$(dirname "$0")" || exit 1

echo
echo "  ==============================================================="
echo "    ORCA - Marine EcOsystem Reasoning with Collaborative Agents"
echo "    Smart India Hackathon 2026  |  SIH26176  |  Team Random"
echo "  ==============================================================="
echo

# ---------- 1. Python ----------
PY=""
for c in python3 python; do
  if "$c" -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)' 2>/dev/null; then
    PY="$c"
    break
  fi
done
if [ -z "$PY" ]; then
  echo "  [X] Python 3.10+ was not found. Install it from https://python.org"
  exit 1
fi
echo "  [OK] Python $($PY --version 2>&1 | cut -d' ' -f2)"

# ---------- 2. Backend dependencies ----------
if "$PY" -c 'import fastapi, uvicorn, pydantic, httpx' 2>/dev/null; then
  echo "  [OK] Backend packages present"
else
  echo "  [..] Installing backend packages (one time, ~30 seconds)..."
  "$PY" -m ensurepip --upgrade >/dev/null 2>&1 || true
  "$PY" -m pip install --quiet --disable-pip-version-check -r backend/requirements.txt \
    || "$PY" -m pip install --quiet --disable-pip-version-check --user -r backend/requirements.txt \
    || { echo "  [X] Could not install Python packages. Try: $PY -m pip install -r backend/requirements.txt"; exit 1; }
  echo "  [OK] Backend packages installed"
fi

# ---------- 3. Frontend build (ships in the repo) ----------
if [ -f frontend/dist/index.html ]; then
  echo "  [OK] Frontend build present"
else
  echo "  [..] Frontend not built yet - building now..."
  command -v npm >/dev/null 2>&1 || { echo "  [X] npm not found and frontend/dist is missing. Install Node.js, then rerun."; exit 1; }
  (cd frontend && [ -d node_modules ] || npm install --no-audit --no-fund) && (cd frontend && npm run build)
  [ -f frontend/dist/index.html ] || { echo "  [X] Frontend build failed."; exit 1; }
  echo "  [OK] Frontend built"
fi

# ---------- 4. Free the port ----------
PORT=8000
if command -v lsof >/dev/null 2>&1; then
  PID=$(lsof -ti tcp:$PORT 2>/dev/null | head -1)
  if [ -n "${PID:-}" ]; then
    echo "  [..] Port $PORT busy - stopping old instance (PID $PID)"
    kill "$PID" 2>/dev/null
    sleep 1
  fi
fi

# ---------- 5. Go ----------
echo
echo "  ---------------------------------------------------------------"
echo "    Starting ORCA on  http://127.0.0.1:$PORT"
echo "    Guided tour       http://127.0.0.1:$PORT/?tour=1"
echo "    Press Ctrl+C to stop."
echo "  ---------------------------------------------------------------"
echo
PYTHONIOENCODING=utf-8
export PYTHONIOENCODING
ORCA_DATA_MODE="${ORCA_DATA_MODE:-DEMO}"
export ORCA_DATA_MODE

( sleep 4
  if command -v open >/dev/null 2>&1; then open "http://127.0.0.1:$PORT/?tour=1"
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "http://127.0.0.1:$PORT/?tour=1"
  fi ) &

cd backend && exec "$PY" -m uvicorn app.main:app --host 127.0.0.1 --port "$PORT"
