#!/data/data/com.termux/files/usr/bin/bash

set -e

echo "======================================"
echo " AI-BOS SYSTEM HEALTH CHECK"
echo " AUTO VERIFY + AUTO REPAIR"
echo "======================================"

PROJECT="$HOME/ai-bos"
ERROR=0

cd "$PROJECT" || exit 1


echo ""
echo "[1] CHECK GIT"

if command -v git >/dev/null; then
    echo "PASS: Git installed"
else
    echo "FAIL: Git missing"
    pkg install git -y
fi


echo ""
echo "[2] CHECK REMOTE"

REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

if [[ "$REMOTE" == *"dayneramit/ai-bos"* ]]; then
    echo "PASS: GitHub remote correct"
else
    echo "REPAIR: Fix remote"

    git remote remove origin 2>/dev/null || true
    git remote add origin https://github.com/dayneramit/ai-bos.git
fi


echo ""
echo "[3] CHECK NODE"

if command -v node >/dev/null; then
    echo "PASS: Node $(node -v)"
else
    echo "REPAIR: Install Node"
    pkg install nodejs -y
fi


echo ""
echo "[4] CHECK NPM"

if command -v npm >/dev/null; then
    echo "PASS: npm $(npm -v)"
else
    echo "FAIL: npm missing"
    ERROR=1
fi


echo ""
echo "[5] CHECK PNPM"

if command -v pnpm >/dev/null; then
    echo "PASS: pnpm $(pnpm -v)"
else
    echo "REPAIR: Install pnpm"
    npm install -g pnpm
fi


echo ""
echo "[6] CHECK GIT IDENTITY"

NAME=$(git config --global user.name || true)
EMAIL=$(git config --global user.email || true)

if [ "$NAME" = "dayneramit" ]; then
    echo "PASS: Git username"
else
    git config --global user.name "dayneramit"
    echo "REPAIR: username fixed"
fi


if [ "$EMAIL" = "dayneramit@gmail.com" ]; then
    echo "PASS: Git email"
else
    git config --global user.email "dayneramit@gmail.com"
    echo "REPAIR: email fixed"
fi


echo ""
echo "[7] CHECK CREDENTIAL"

HELPER=$(git config --global credential.helper || true)

if [ "$HELPER" = "store" ]; then
    echo "PASS: Credential store"
else
    git config --global credential.helper store
    echo "REPAIR: credential enabled"
fi


echo ""
echo "[8] CHECK PROJECT FILES"


create_file(){

if [ ! -f "$1" ]; then
    echo "CREATE: $1"
    eval "$2"
else
    echo "PASS: $1"
fi

}


create_file package.json "cat > package.json <<'JSON'
{
  \"name\": \"ai-bos\",
  \"private\": true,
  \"version\": \"0.1.0\",
  \"packageManager\": \"pnpm@10\"
}
JSON"


create_file pnpm-workspace.yaml "cat > pnpm-workspace.yaml <<'YAML'
packages:
  - \"apps/*\"
  - \"packages/*\"
YAML"


echo ""
echo "[9] CHECK DOCUMENTATION"


for FILE in AI-BOS-CONTEXT.md README.md
do
if [ -f "$FILE" ]; then
 echo "PASS: $FILE"
else
 echo "WARNING: Missing $FILE"
fi
done


echo ""
echo "[10] CHECK STRUCTURE"


DIRS="
apps/day-neramit
apps/nc-logistics
packages/ui
packages/config
packages/utils
"


for DIR in $DIRS
do

if [ -d "$DIR" ]; then
 echo "PASS: $DIR"
else
 echo "CREATE: $DIR"
 mkdir -p "$DIR"
 touch "$DIR/.gitkeep"
fi

done


echo ""
echo "[11] FINAL TEST"

if pnpm -v >/dev/null && node -v >/dev/null; then

echo ""
echo "======================================"
echo " AI-BOS HEALTH CHECK PASSED"
echo "======================================"

else

echo ""
echo "======================================"
echo " AI-BOS HEALTH CHECK FAILED"
echo "======================================"

exit 1

fi


echo ""
echo "GIT STATUS"
echo "--------------------------------"

git status

echo ""
echo "DONE"
