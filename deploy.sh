#!/bin/bash
set -e

MODE=${1:-preview}
PROJECT="rl-intranet"
SSH_USER="web6"
SSH_HOST="hosting.suchycreative.de"
NODE_PATH="/opt/plesk/node/20/bin"
PM2="/var/www/vhosts/web6.d2-1053.ncsrv.de/.npm-global/bin/pm2"

if [ "$MODE" = "preview" ]; then
  REMOTE_PATH="/var/www/vhosts/web6.d2-1053.ncsrv.de/rl-intranet.scpreview.de/"
  URL="https://rl-intranet.scpreview.de"
elif [ "$MODE" = "live" ]; then
  REMOTE_PATH="/var/www/vhosts/web6.d2-1053.ncsrv.de/intern.raederlogistik.de/"
  URL="https://intern.raederlogistik.de"
else
  echo "Verwendung: ./deploy.sh preview|live"
  exit 1
fi

echo "▶ Quellcode auf Server übertragen..."
# KEIN .next übertragen – Build läuft auf dem Server (native module better-sqlite3)
rsync -avz --delete \
  --exclude='.git' \
  --exclude='.env*' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='*.db' \
  --exclude='*.db-shm' \
  --exclude='*.db-wal' \
  --exclude='.php-version' \
  --exclude='.php-ini' \
  ./ "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"

echo "▶ Build auf Server starten (native modules)..."
ssh "${SSH_USER}@${SSH_HOST}" "
  export PATH=${NODE_PATH}:\$PATH
  cd ${REMOTE_PATH}

  echo '  npm install...'
  npm install 2>&1 | tail -3

  echo '  npm run build...'
  npm run build 2>&1 | tail -15

  echo '  DB-Tabellen aktualisieren...'
  DATABASE_URL='file:./dev.db' npx prisma db push 2>&1 | tail -3

  echo '  PM2 neu starten...'
  ${PM2} restart ${PROJECT} 2>&1 || ${PM2} start npm --name ${PROJECT} -- start 2>&1

  echo 'Server bereit.'
"

echo ""
echo "✅ Deployed: $URL"

# Git: aktuellen Stand committen und pushen
echo "▶ Git: Stand sichern..."
cd "$(dirname "$0")"
git add -A
git commit -m "deploy($MODE): $(date '+%Y-%m-%d %H:%M')" || echo "(Nichts zu committen)"
git push
echo "✅ Git-Push abgeschlossen"
