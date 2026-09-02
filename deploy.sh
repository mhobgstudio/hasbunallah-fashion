#!/bin/bash
# Deploy Hasbunallah Fashion to Cloudflare Pages
# Usage: ./deploy.sh

PROJECT_NAME="hasbunallah-fashion"

WRANGLER="/tmp/node_modules/wrangler/bin/wrangler.js"
# CLOUDFLARE_API_TOKEN should be set in environment or .env file
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN not set. Export it or add to .env"
  exit 1
fi

echo "🚀 Deploying $PROJECT_NAME to Cloudflare Pages..."
node "$WRANGLER" pages deploy . --project-name="$PROJECT_NAME" --branch=main 2>&1 | tail -5

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Live at: https://${PROJECT_NAME}.pages.dev/"
  # Auto-update testimonials registry
  ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
  if [ -f "$ROOT_DIR/update-testimonials.js" ]; then
    echo "📋 Updating testimonials..."
    cd "$ROOT_DIR"
    node update-testimonials.js --deploy 2>&1 | tail -3
  fi
else
  echo "❌ Deploy failed"
  exit 1
fi
