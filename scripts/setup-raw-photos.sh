#!/usr/bin/env bash
# setup-raw-photos.sh
# ──────────────────────────────────────────────────────────
# Copies/renames your 4 fleet photos into images/raw/
# Usage:
#   bash scripts/setup-raw-photos.sh <photo1> <photo2> <photo3> <photo4>
#
# The order should match:
#   $1 → fleet-1.jpg  (Komatsu excavator loading Scania)
#   $2 → fleet-2.jpg  (DAF tipper truck parked)
#   $3 → fleet-3.jpg  (Excavator + Scania second angle)
#   $4 → fleet-4.jpg  (Scania loaded with red soil)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RAW_DIR="$SCRIPT_DIR/../images/raw"
mkdir -p "$RAW_DIR"

if [[ $# -lt 4 ]]; then
  # Auto-mode: pick the 4 most recent image files in Downloads
  DOWNLOADS="$HOME/Downloads"
  PICTURES="$HOME/Pictures"
  DESKTOP="$HOME/Desktop"

  echo "Searching for recent images in Downloads, Pictures, Desktop..."
  FOUND=()
  while IFS= read -r f; do
    FOUND+=("$f")
  done < <(find "$DOWNLOADS" "$PICTURES" "$DESKTOP" -maxdepth 2 \
    \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) \
    -not -name ".*" 2>/dev/null \
    | xargs ls -t 2>/dev/null \
    | head -4)

  if [[ ${#FOUND[@]} -lt 4 ]]; then
    echo ""
    echo "❌  Could not auto-find 4 images. Please pass them explicitly:"
    echo ""
    echo "  bash scripts/setup-raw-photos.sh photo1.jpg photo2.jpg photo3.jpg photo4.jpg"
    echo ""
    echo "Or save the 4 chat images directly to:"
    echo "  $RAW_DIR/"
    echo ""
    echo "With these exact filenames:"
    echo "  fleet-1.jpg  — Komatsu excavator loading Scania"
    echo "  fleet-2.jpg  — DAF tipper truck parked"
    echo "  fleet-3.jpg  — Excavator + Scania second angle"
    echo "  fleet-4.jpg  — Scania loaded with red soil"
    exit 1
  fi

  echo "Found ${#FOUND[@]} images:"
  for i in "${!FOUND[@]}"; do
    echo "  $((i+1)). ${FOUND[$i]}"
  done
  echo ""
  read -p "Use these in this order? (y/N) " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }

  ARGS=("${FOUND[@]}")
else
  ARGS=("$@")
fi

NAMES=("fleet-1" "fleet-2" "fleet-3" "fleet-4")

for i in 0 1 2 3; do
  SRC="${ARGS[$i]}"
  EXT="${SRC##*.}"
  EXT="${EXT,,}"  # lowercase
  [[ "$EXT" == "jpeg" ]] && EXT="jpg"
  DEST="$RAW_DIR/${NAMES[$i]}.jpg"

  cp "$SRC" "$DEST"
  echo "✅  Copied $(basename "$SRC") → images/raw/${NAMES[$i]}.jpg"
done

echo ""
echo "✨  All 4 photos ready in images/raw/"
echo ""
echo "Now run:"
echo "  npx ts-node --esm scripts/edit-real-images.ts"
