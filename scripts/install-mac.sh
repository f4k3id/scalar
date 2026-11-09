#!/bin/bash
# Install Scalar on an Apple Silicon Mac from a GitHub release.
# Usage: bash scripts/install-mac.sh [version]   (default: latest release)
# Or:    curl -fsSL https://raw.githubusercontent.com/f4k3id/scalar/master/scripts/install-mac.sh | bash
set -euo pipefail

REPO="f4k3id/scalar"
VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  VERSION=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" | sed -n 's/.*"tag_name": *"v\{0,1\}\([^"]*\)".*/\1/p' | head -1)
fi
VERSION="${VERSION#v}"
[ -n "$VERSION" ] || { echo "Could not determine the version to install." >&2; exit 1; }

ZIP="Scalar-$VERSION-mac-arm64.zip"
BASE="https://github.com/$REPO/releases/download/v$VERSION"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
cd "$TMP"

echo "Downloading Scalar $VERSION..."
curl -fL --progress-bar -O "$BASE/$ZIP"
curl -fsSL -O "$BASE/SHA256SUMS"

echo "Verifying SHA-256..."
grep " $ZIP\$" SHA256SUMS | shasum -a 256 -c -

if pgrep -x Scalar >/dev/null; then
  echo "Quitting Scalar..."
  osascript -e 'quit app "Scalar"' || true
  sleep 2
fi

echo "Installing to /Applications..."
rm -rf /Applications/Scalar.app
ditto -x -k "$ZIP" /Applications
xattr -dr com.apple.quarantine /Applications/Scalar.app 2>/dev/null || true

echo "Scalar $VERSION installed. Your history and settings are kept."
open /Applications/Scalar.app
