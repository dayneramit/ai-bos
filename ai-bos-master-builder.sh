#!/data/data/com.termux/files/usr/bin/bash

set -e

echo "================================"
echo " AI-BOS MASTER BUILDER"
echo " PHASE 1 + PHASE 2"
echo "================================"

PROJECT="$HOME/ai-bos"

cd "$PROJECT"


echo ""
echo "[1] ENVIRONMENT CHECK"

command -v node >/dev/null || {
  echo "Node missing"
  pkg install nodejs -y
}

command -v pnpm >/dev/null || {
  echo "pnpm missing"
  npm install -g pnpm
}

echo "Node: $(node -v)"
echo "npm : $(npm -v)"
echo "pnpm: $(pnpm -v)"


echo ""
echo "[2] WORKSPACE CHECK"

if [ ! -f package.json ]; then
cat > package.json <<JSON
{
  "name": "ai-bos",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "build": "pnpm -r build"
  },
  "packageManager": "pnpm@$(pnpm -v)"
}
JSON
fi


if [ ! -f pnpm-workspace.yaml ]; then
cat > pnpm-workspace.yaml <<YAML
packages:
  - "apps/*"
  - "packages/*"
YAML
fi


echo ""
echo "[3] DAY NERAMIT APP CHECK"


if [ ! -f apps/day-neramit/package.json ]; then

echo "Creating Next.js Day Neramit..."

pnpm create next-app apps/day-neramit \
--ts \
--tailwind \
--eslint \
--app \
--src-dir \
--import-alias "@/*" \
--use-pnpm

else

echo "Day Neramit already exists"

fi


echo ""
echo "[4] INSTALL"

pnpm install


echo ""
echo "[5] BUILD TEST"

pnpm --filter day-neramit build


echo ""
echo "================================"
echo " AI-BOS MASTER BUILDER PASS"
echo "================================"


echo ""
echo "GIT STATUS"
git status

