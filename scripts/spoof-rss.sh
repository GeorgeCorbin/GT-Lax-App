#!/usr/bin/env bash
# Spoof the RSS feed for local testing by generating a hosted test RSS file
# and (optionally) temporarily pointing fetchRSSFeed() to the spoofed URL.
#
# Usage:
#   scripts/spoof-rss.sh generate        # Generate test RSS and deploy hosting
#   scripts/spoof-rss.sh patch           # Patch articleUtils to use test RSS URL
#   scripts/spoof-rss.sh restore         # Restore articleUtils.tsx from backup and remove test RSS (optional)
#
# Notes:
# - This script does NOT run deploys automatically unless you run the generate command.
# - You must have Firebase CLI configured for this project to deploy hosting.
# - Patching uses a simple in-place replacement of the rssURL line and creates a .bak backup.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC_DIR="$ROOT_DIR/firebase/public"
UTILS_FILE="$ROOT_DIR/app/utils/articleUtils.tsx"
BACKUP_FILE="$UTILS_FILE.bak"
TEST_RSS="$PUBLIC_DIR/test_rss.xml"
TEST_RSS_URL="https://gt-lax-app.web.app/test_rss.xml"

now_rfc2822() {
  date -u "+%a, %d %b %Y %H:%M:%S GMT"
}

make_test_rss() {
  local ts="$(date +%s)"
  local pubdate="$(now_rfc2822)"
  cat > "$TEST_RSS" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>GT Lacrosse (Test)</title>
    <link>https://gt-lax-app.web.app/</link>
    <description>Test feed for app validation</description>
    <language>en-us</language>

    <item>
      <title>Test Article One</title>
      <link>https://www.gtlacrosse.com/article/test-one?ts=$ts</link>
      <pubDate>$pubdate</pubDate>
      <description>First test article.</description>
      <media:content url="https://gt-lax-app.web.app/assets/default-article.jpg" />
    </item>

    <item>
      <title>Test Article Two</title>
      <link>https://www.gtlacrosse.com/article/test-two?ts=$((ts+1))</link>
      <pubDate>$pubdate</pubDate>
      <description>Second test article.</description>
      <media:content url="https://gt-lax-app.web.app/assets/default-article.jpg" />
    </item>

  </channel>
</rss>
EOF
}

cmd_generate() {
  echo "[spoof-rss] Generating test RSS at $TEST_RSS"
  mkdir -p "$PUBLIC_DIR"
  make_test_rss
  echo "[spoof-rss] Test RSS created. Deploy to hosting to make it live at: $TEST_RSS_URL"
  echo "[spoof-rss] Running: firebase deploy --only hosting (in $ROOT_DIR/firebase)"
  (cd "$ROOT_DIR/firebase" && firebase deploy --only hosting)
  echo "[spoof-rss] Deployed. Verify in browser: $TEST_RSS_URL"
}

cmd_patch() {
  echo "[spoof-rss] Patching $UTILS_FILE to point to $TEST_RSS_URL"
  if [[ ! -f "$UTILS_FILE" ]]; then
    echo "[spoof-rss] ERROR: $UTILS_FILE not found" >&2
    exit 1
  fi
  if [[ ! -f "$BACKUP_FILE" ]]; then
    cp "$UTILS_FILE" "$BACKUP_FILE"
    echo "[spoof-rss] Backup created at $BACKUP_FILE"
  else
    echo "[spoof-rss] Backup already exists at $BACKUP_FILE"
  fi

  # Replace the rssURL assignment line to use the test RSS
  # Original pattern example:
  #   const rssURL = 'https://www.gtlacrosse.com/landing/headlines-featured?print=rss';
  # We replace the first occurrence of const rssURL = '...'; with our test URL.
  sed -E -i '' "0,/(const rssURL = ').*(';)/s//\1$TEST_RSS_URL\2/" "$UTILS_FILE"
  echo "[spoof-rss] Patched rssURL to $TEST_RSS_URL"
  echo "[spoof-rss] Rebuild/restart your app, then call fetchArticles(true) to test detection"
}

cmd_restore() {
  echo "[spoof-rss] Restoring $UTILS_FILE from backup if present"
  if [[ -f "$BACKUP_FILE" ]]; then
    mv -f "$BACKUP_FILE" "$UTILS_FILE"
    echo "[spoof-rss] Restored original articleUtils.tsx"
  else
    echo "[spoof-rss] No backup file found at $BACKUP_FILE; skipping restore"
  fi

  if [[ -f "$TEST_RSS" ]]; then
    echo "[spoof-rss] Test RSS remains at $TEST_RSS (safe to keep). To remove: rm \"$TEST_RSS\" and redeploy hosting."
  fi
}

usage() {
  cat <<USAGE
Usage: scripts/spoof-rss.sh <command>

Commands:
  generate   Create firebase/public/test_rss.xml and deploy hosting
  patch      Patch app/utils/articleUtils.tsx to use $TEST_RSS_URL (backup created)
  restore    Restore original articleUtils.tsx from backup and keep the test feed file

Examples:
  scripts/spoof-rss.sh generate
  scripts/spoof-rss.sh patch
  scripts/spoof-rss.sh restore
USAGE
}

main() {
  local cmd="${1:-}"
  case "$cmd" in
    generate) cmd_generate ;;
    patch)    cmd_patch ;;
    restore)  cmd_restore ;;
    *) usage; exit 1 ;;
  esac
}

main "$@"
