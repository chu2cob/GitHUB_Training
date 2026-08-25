import os
import time
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright
import imageio.v3 as iio

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "test-results" / "dashboard-proof.mp4"
OUT.parent.mkdir(parents=True, exist_ok=True)

frames = []

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1200})
    page.goto(f"file:///{ROOT / 'index.html'}")
    page.wait_for_load_state("load")

    for i in range(18):
        # rotate through the user-visible states to make a short motion video
        if i % 5 == 0:
            page.locator('.fleet-item').nth(0).click()
        elif i % 5 == 1:
            page.locator('.fleet-item').nth(1).click()
        elif i % 5 == 2:
            page.locator('[data-view="settings"]').click()
            page.locator('#themeToggle').click()
        elif i % 5 == 3:
            page.locator('[data-view="settings"]').click()
            page.locator('#unitToggle').click()
        else:
            page.locator('[data-view="settings"]').click()
            page.locator('#paletteSelect').select_option('copper')
        page.wait_for_timeout(400)
        png = page.screenshot(full_page=True)
        img = Image.open(__import__('io').BytesIO(png))
        frames.append(img.copy())

    browser.close()

# Export MP4 using imageio ffmpeg backend
if frames:
    iio.imwrite(
        OUT,
        [frame.copy().convert('RGB') for frame in frames],
        fps=8,
        codec='libx264',
        quality=8,
    )

print(f"Video saved at: {OUT}")
print(f"Frame count: {len(frames)}")
