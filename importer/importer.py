import os
from PIL import Image
import pytesseract

# Tell Python where Tesseract is
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Folder containing this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Cards folder (always relative to importer.py)
CARDS_FOLDER = os.path.join(SCRIPT_DIR, "cards")

cards = [
    f for f in os.listdir(CARDS_FOLDER)
    if f.lower().endswith(".png")
]

print(f"Found {len(cards)} cards.")

if len(cards) == 0:
    print("No PNG files found!")
    quit()

first_card = os.path.join(CARDS_FOLDER, cards[0])

print("Opening:", cards[0])

image = Image.open(first_card)

print("Image size:", image.size)

# Crop the name area
name_crop = image.crop((120, 18, 510, 70))

# Uncomment if you want to see the crop
name_crop.show()

# OCR
from PIL import ImageOps

# Convert to grayscale
gray = ImageOps.grayscale(name_crop)

# Increase contrast by thresholding
bw = gray.point(lambda x: 255 if x > 150 else 0)

bw.show()

name = pytesseract.image_to_string(
    bw,
    config="--psm 7"
)

print(repr(name))

print("Detected name:")
print(repr(name))