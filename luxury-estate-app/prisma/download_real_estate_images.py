import sys
import re
import requests
from pathlib import Path

if len(sys.argv) < 3:
    print("Usage: python download_real_estate_images.py <PEXELS_API_KEY> <COUNT>")
    sys.exit(1)

PEXELS_API_KEY = sys.argv[1]
target_images = int(sys.argv[2])

DOWNLOAD_FOLDER = Path.home() / "Downloads" / "real-estate-seed-images"
DOWNLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

existing = []
for f in DOWNLOAD_FOLDER.iterdir():
    m = re.match(r'^house_(\d+)\.jpg$', f.name)
    if m:
        existing.append(int(m.group(1)))

start_num = max(existing) + 1 if existing else 1

headers = {
    "Authorization": PEXELS_API_KEY
}

search_terms = [
    "modern house",
    "luxury home",
    "suburban house",
    "villa exterior",
    "residential property",
    "family home",
    "townhouse",
    "contemporary house",
    "real estate house",
    "mansion exterior"
]

saved = 0
page = 1

for term in search_terms:
    while saved < target_images:
        url = f"https://api.pexels.com/v1/search?query={term}&per_page=80&page={page}"

        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            print(f"API error: {response.status_code}")
            break

        data = response.json()

        photos = data.get("photos", [])

        if not photos:
            break

        for photo in photos:
            if saved >= target_images:
                break

            image_url = photo["src"]["large"]

            try:
                img = requests.get(image_url, timeout=30)

                num = start_num + saved
                filename = DOWNLOAD_FOLDER / f"house_{num:03d}.jpg"

                with open(filename, "wb") as f:
                    f.write(img.content)

                saved += 1

                print(f"Downloaded {saved}/{target_images} name house_{num:03d}.jpg")

            except Exception as ex:
                print(ex)

        page += 1

        if saved >= target_images:
            break

    if saved >= target_images:
        break

print(f"Finished. Downloaded {saved} images.")
print(f"Location: {DOWNLOAD_FOLDER}")
