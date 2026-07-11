#!/data/data/com.termux/files/usr/bin/bash

set -e

echo "================================"
echo " AI-BOS MASTER BUILDER"
echo " Phase 1 START"
echo "================================"

PROJECT="$HOME/ai-bos"

cd "$PROJECT"

echo "[CHECK] Location"
pwd

echo "[CHECK] Node"
node -v

echo "[CHECK] npm"
npm -v

echo "[CHECK] pnpm"
pnpm -v

echo "[CHECK] Git"
git status

echo "================================"
echo " PHASE 1 COMPLETE"
echo "================================"

