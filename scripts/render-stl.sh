#!/usr/bin/env bash
# Render de preview — wrapper corto para scripts/render-stl.py
#
#   ./scripts/render-stl.sh pieza.stl [preview.png]
#
# Opcional: BLENDER=/ruta/al/blender para usar otra instalación.
set -euo pipefail

BLENDER="${BLENDER:-/Applications/Blender.app/Contents/MacOS/Blender}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

INPUT="${1:?Uso: render-stl.sh <archivo.stl|.obj> [salida.png]}"
OUT="${2:-$(basename "${INPUT%.*}")-preview.png}"

if [ ! -f "$INPUT" ]; then
  echo "No existe el archivo: $INPUT" >&2
  exit 1
fi

if [ ! -x "$BLENDER" ]; then
  echo "No encontré Blender en $BLENDER" >&2
  echo "Ajusta BLENDER=/ruta/al/blender o instala Blender." >&2
  exit 1
fi

"$BLENDER" --background --python "$DIR/render-stl.py" -- \
  --input "$INPUT" --output "$OUT"

echo "Preview: $OUT"
