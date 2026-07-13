#!/data/data/com.termux/files/usr/bin/bash

set -e

echo "================================"
echo " FIX NEXT BUILD FOR TERMUX"
echo "================================"

APP="apps/day-neramit/package.json"

if [ ! -f "$APP" ]; then
  echo "ERROR: package.json not found"
  exit 1
fi


node <<'NODE'
const fs=require("fs");

const file="apps/day-neramit/package.json";

let pkg=JSON.parse(fs.readFileSync(file,"utf8"));

pkg.scripts={
  ...pkg.scripts,
  build:"next build --webpack"
};

fs.writeFileSync(
 file,
 JSON.stringify(pkg,null,2)
);

console.log("Updated build script");
NODE


echo ""
echo "TEST BUILD"

pnpm --filter day-neramit build


echo ""
echo "================================"
echo " BUILD TEST COMPLETE"
echo "================================"

