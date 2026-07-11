#!/data/data/com.termux/files/usr/bin/bash

set -e

echo "================================"
echo " AI-BOS Workspace Setup"
echo "================================"

PROJECT_DIR="$HOME/ai-bos"

# Check project directory
if [ ! -d "$PROJECT_DIR" ]; then
    echo "[ERROR] Project folder not found"
    exit 1
fi

cd "$PROJECT_DIR"

echo "[1/6] Checking Node.js..."

if ! command -v node >/dev/null 2>&1; then
    echo "Node.js missing. Installing..."
    pkg install nodejs -y
else
    echo "Node.js OK: $(node -v)"
fi


echo "[2/6] Checking pnpm..."

if ! command -v pnpm >/dev/null 2>&1; then
    echo "pnpm missing. Installing..."
    npm install -g pnpm
else
    echo "pnpm OK: $(pnpm -v)"
fi


echo "[3/6] Checking package.json..."

if [ ! -f package.json ]; then

cat > package.json <<'JSON'
{
  "name": "ai-bos",
  "private": true,
  "version": "0.1.0",
  "packageManager": "pnpm@10"
}
JSON

echo "Created package.json"

else

echo "package.json exists"

fi


echo "[4/6] Checking pnpm workspace..."

if [ ! -f pnpm-workspace.yaml ]; then

cat > pnpm-workspace.yaml <<'YAML'
packages:
  - "apps/*"
  - "packages/*"
YAML

echo "Created pnpm-workspace.yaml"

else

echo "pnpm-workspace.yaml exists"

fi


echo "[5/6] Checking folders..."

mkdir -p \
apps/day-neramit \
apps/nc-logistics \
packages/ui \
packages/config \
packages/utils


touch \
apps/day-neramit/.gitkeep \
apps/nc-logistics/.gitkeep \
packages/ui/.gitkeep \
packages/config/.gitkeep \
packages/utils/.gitkeep


echo "[6/6] Running validation..."

FAILED=0


if [ ! -f package.json ]; then
    echo "FAIL: package.json"
    FAILED=1
fi


if [ ! -f pnpm-workspace.yaml ]; then
    echo "FAIL: pnpm-workspace.yaml"
    FAILED=1
fi


for DIR in \
apps/day-neramit \
apps/nc-logistics \
packages/ui \
packages/config \
packages/utils

do

if [ ! -d "$DIR" ]; then
    echo "FAIL: $DIR"
    FAILED=1
fi

done


if [ "$FAILED" -eq 0 ]; then

echo ""
echo "================================"
echo " AI-BOS SETUP PASSED"
echo "================================"

git status

else

echo ""
echo "================================"
echo " AI-BOS SETUP FAILED"
echo "================================"

exit 1

fi

