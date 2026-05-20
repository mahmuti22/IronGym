"""
Rimuove lo sfondo bianco attorno al logo (flood-fill dai bordi).
Richiede: pip install Pillow
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw


def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: remove_logo_white_bg.py <input.png> <output.png> [thresh]")
        sys.exit(1)
    path_in = Path(sys.argv[1])
    path_out = Path(sys.argv[2])
    thresh = int(sys.argv[3]) if len(sys.argv) > 3 else 38

    im = Image.open(path_in).convert("RGBA")
    w, h = im.size
    pad = 3
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (255, 255, 255, 255))
    canvas.paste(im, (pad, pad), im)

    corners = [
        (0, 0),
        (canvas.width - 1, 0),
        (0, canvas.height - 1),
        (canvas.width - 1, canvas.height - 1),
    ]
    for xy in corners:
        ImageDraw.floodfill(canvas, xy, (0, 0, 0, 0), thresh=thresh)

    out = canvas.crop((pad, pad, pad + w, pad + h))
    path_out.parent.mkdir(parents=True, exist_ok=True)
    out.save(path_out, optimize=True)
    print(f"Wrote {path_out} ({out.size[0]}x{out.size[1]})")


if __name__ == "__main__":
    main()
