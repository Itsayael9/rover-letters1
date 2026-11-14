from PIL import Image
from pathlib import Path
from collections import deque

root = Path(r"c:\Users\ayaao\rover-letters\public\images")


def flood_clear(im, start_threshold=62):
    w, h = im.size
    px = im.load()
    seen = [[False] * w for _ in range(h)]
    q = deque()

    def is_bg(x, y):
        r, g, b, a = px[x, y]
        if a == 0:
            return True
        luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
        sat = max(r, g, b) - min(r, g, b)
        if sat > 40 and (b > r + 12 or b > g + 6):
            return False
        return luma <= start_threshold

    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or seen[y][x]:
            continue
        seen[y][x] = True
        if not is_bg(x, y):
            continue
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    for _ in range(3):
        doomed = []
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                r, g, b, a = px[x, y]
                if a == 0:
                    continue
                neighbors = (
                    px[x + 1, y][3],
                    px[x - 1, y][3],
                    px[x, y + 1][3],
                    px[x, y - 1][3],
                )
                empty = neighbors.count(0)
                luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
                sat = max(r, g, b) - min(r, g, b)
                if empty >= 2 and luma < 95 and sat < 55:
                    doomed.append((x, y))
                elif empty >= 1 and luma < 55 and sat < 30:
                    doomed.append((x, y))
        for x, y in doomed:
            r, g, b, _ = px[x, y]
            px[x, y] = (r, g, b, 0)


def cutout(src_name, dest_name, threshold):
    im = Image.open(root / src_name).convert("RGBA")
    flood_clear(im, threshold)
    dest = root / dest_name
    im.save(dest, "PNG")
    print("saved", dest)


cutout("astronaut-child.jpeg", "astronaut-child.png", 38)
cutout("robot.jpeg", "robot.png", 88)
