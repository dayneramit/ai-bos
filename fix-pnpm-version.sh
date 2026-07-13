#!/data/data/com.termux/files/usr/bin/bash

PNPM_VERSION=$(pnpm -v)

echo "Detected pnpm: $PNPM_VERSION"

cat > package.json <<JSON
{
  "name": "ai-bos",
  "private": true,
  "version": "0.1.0",
  "packageManager": "pnpm@$PNPM_VERSION"
}
JSON

echo "package.json updated"

cat package.json
