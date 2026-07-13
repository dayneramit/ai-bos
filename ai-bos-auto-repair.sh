#!/data/data/com.termux/files/usr/bin/bash

set -e

echo "======================================"
echo " AI-BOS AUTO REPAIR SYSTEM"
echo " CHECK + FIX + BUILD"
echo "======================================"

PROJECT="$HOME/ai-bos"

cd "$PROJECT"

echo "[1] CHECK ENVIRONMENT"

command -v node >/dev/null || {
  echo "ERROR: Node not found"
  exit 1
}

command -v pnpm >/dev/null || {
  echo "Installing pnpm..."
  npm install -g pnpm
}

echo "Node : $(node -v)"
echo "npm  : $(npm -v)"
echo "pnpm : $(pnpm -v)"


echo ""
echo "[2] CHECK WORKSPACE"

if [ ! -f pnpm-workspace.yaml ]; then
cat > pnpm-workspace.yaml <<YAML
packages:
  - "apps/*"
  - "packages/*"
YAML
echo "Created pnpm-workspace.yaml"
fi


echo ""
echo "[3] CHECK DAY NERAMIT"

APP="apps/day-neramit"

if [ ! -f "$APP/package.json" ]; then
  echo "ERROR: day-neramit app missing"
  exit 1
fi

echo "App detected"


echo ""
echo "[4] REPAIR NEXT CONFIG"

cat > "$APP/next.config.ts" <<'CONF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: false
};

export default nextConfig;
CONF


echo "Next config fixed"


echo ""
echo "[5] REPAIR PACKAGE SCRIPT"

node <<'NODE'
const fs=require("fs");

const file="apps/day-neramit/package.json";

let pkg=JSON.parse(fs.readFileSync(file,"utf8"));

pkg.scripts={
  ...pkg.scripts,
  dev:"next dev",
  build:"next build",
  start:"next start"
};

fs.writeFileSync(
 file,
 JSON.stringify(pkg,null,2)
);
NODE

echo "package.json fixed"


echo ""
echo "[6] CLEAN CACHE"

pnpm store prune || true


echo ""
echo "[7] INSTALL DEPENDENCY"

pnpm install


echo ""
echo "[8] APPROVE BUILD"

pnpm approve-builds --all || true


echo ""
echo "[9] BUILD TEST"

pnpm --filter day-neramit build


echo ""
echo "[10] GIT CHECK"

git status


echo ""
echo "======================================"
echo " AI-BOS AUTO REPAIR SUCCESS"
echo "======================================"

