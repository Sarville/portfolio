#!/bin/bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

echo "==> Fetching latest code..."
git fetch origin main

# Checkout only code files — data/ and public/uploads/ are managed separately
git checkout origin/main -- \
  server.js package.json package-lock.json Dockerfile .gitignore \
  public/index.html public/main.js public/style.css \
  public/admin \
  public/uploads

echo "==> Building Docker image..."
docker build -t portfolio .

echo "==> Restarting container..."
docker stop portfolio 2>/dev/null || true
docker rm   portfolio 2>/dev/null || true

# Load env vars from .env (not committed — create manually on server)
if [ -f "$REPO_DIR/.env" ]; then
  set -a; source "$REPO_DIR/.env"; set +a
fi

docker run -d --name portfolio --restart unless-stopped \
  -p 127.0.0.1:3003:3000 \
  -v "$REPO_DIR/data:/app/data" \
  -v "$REPO_DIR/public/uploads:/app/public/uploads" \
  -e ADMIN_PASSWORD="${ADMIN_PASSWORD:?ADMIN_PASSWORD not set}" \
  -e SARVILLE_NOTIFY_URL="${SARVILLE_NOTIFY_URL:-}" \
  -e SARVILLE_NOTIFY_SECRET="${SARVILLE_NOTIFY_SECRET:-}" \
  portfolio

echo "==> Done. Portfolio running on port 3003."
