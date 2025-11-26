import os
from PIL import Image
from rembg import remove
import numpy as np

# Configuration
INPUT_IMAGE_PATH = r"C:\Users\colte\.gemini\antigravity\brain\1aa64f05-0930-4329-a33f-65e5940b7ef0\uploaded_image_1764186399660.png"
OUTPUT_DIR = r"c:\Users\colte\twelveninja\public\assets\world-tiles"
ROWS = 2
COLS = 5

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = Image.difference(im, bg)
    diff = Image.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

def process_tiles():
    print(f"Loading image from {INPUT_IMAGE_PATH}...")
    try:
        img = Image.open(INPUT_IMAGE_PATH)
    except Exception as e:
        print(f"Error loading image: {e}")
        return

    width, height = img.size
    tile_width = width // COLS
    tile_height = height // ROWS
    
    print(f"Image size: {width}x{height}")
    print(f"Tile size: {tile_width}x{tile_height}")
    
    ensure_dir(OUTPUT_DIR)
    
    count = 0
    for r in range(ROWS):
        for c in range(COLS):
            count += 1
            print(f"Processing tile {count}/{ROWS*COLS}...")
            
            left = c * tile_width
            upper = r * tile_height
            right = left + tile_width
            lower = upper + tile_height
            
            # Crop
            tile = img.crop((left, upper, right, lower))
            
            # Remove background
            print("  Removing background...")
            output = remove(tile)
            
            # Trim whitespace
            print("  Trimming...")
            # rembg returns an image with transparency. 
            # We can trim based on alpha channel.
            bbox = output.getbbox()
            if bbox:
                output = output.crop(bbox)
            
            filename = f"tile_{count:02d}.png"
            output_path = os.path.join(OUTPUT_DIR, filename)
            output.save(output_path)
            print(f"  Saved {filename}")

if __name__ == "__main__":
    process_tiles()
