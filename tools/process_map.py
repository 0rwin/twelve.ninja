import cv2
import numpy as np
import json
import os
import sys

import logging

# Configuration
INPUT_IMAGE_PATH = r"C:\Users\colte\.gemini\antigravity\brain\1aa64f05-0930-4329-a33f-65e5940b7ef0\uploaded_image_1764183546085.png"
OUTPUT_DIR = r"c:\Users\colte\twelveninja\public\maps\hexes"
DATA_OUTPUT_PATH = r"c:\Users\colte\twelveninja\src\data\map_layout.json"
LOG_PATH = r"c:\Users\colte\twelveninja\tools\process_log.txt"

logging.basicConfig(filename=LOG_PATH, level=logging.INFO, format='%(message)s')

def print(msg):
    logging.info(msg)
    sys.stdout.write(msg + '\n')

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def process_map():
    print(f"Loading image from {INPUT_IMAGE_PATH}...")
    img = cv2.imread(INPUT_IMAGE_PATH)
    if img is None:
        print("Error: Could not load image.")
        sys.exit(1)

    print(f"Image shape: {img.shape}")
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Adaptive Thresholding
    # blockSize: Size of a pixel neighborhood that is used to calculate a threshold value for the pixel: 3, 5, 7, and so on.
    # C: Constant subtracted from the mean or weighted mean
    thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
    
    # Morphological operations to close gaps in lines
    kernel = np.ones((5,5), np.uint8) # Increased kernel size
    closing = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=3)
    dilation = cv2.dilate(closing, kernel, iterations=1) # Dilate to connect edges
    
    # Find contours
    contours, _ = cv2.findContours(dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    hexagons = []
    
    print(f"Found {len(contours)} contours. Filtering for hexagons...")
    
    # Sort contours by area descending
    contours = sorted(contours, key=cv2.contourArea, reverse=True)

    for i, cnt in enumerate(contours):
        area = cv2.contourArea(cnt)
        if i < 10:
             print(f"Top Contour {i}: Area={area}")

    for i, cnt in enumerate(contours):
        area = cv2.contourArea(cnt)
        if area < 5000: continue 

        # Approximate contour
        epsilon = 0.005 * cv2.arcLength(cnt, True) # Even smaller epsilon
        approx = cv2.approxPolyDP(cnt, epsilon, True)
        
        x,y,w,h = cv2.boundingRect(cnt)
        aspect_ratio = float(w)/h
        
        if i < 50:
            print(f"Contour {i}: Area={area}, Vertices={len(approx)}, AR={aspect_ratio:.2f}")

        # Filter based on number of vertices and aspect ratio
        if 0.5 < aspect_ratio < 2.0:
            # It's likely a hexagon or circle
            M = cv2.moments(cnt)
            if M["m00"] != 0:
                cX = int(M["m10"] / M["m00"])
                cY = int(M["m01"] / M["m00"])
            else:
                cX, cY = 0, 0
            
            # Check if we already have a hexagon near this center (duplicate detection)
            duplicate = False
            for h in hexagons:
                dist = np.sqrt((h["center"][0]-cX)**2 + (h["center"][1]-cY)**2)
                if dist < 20:
                    duplicate = True
                    break
            
            if not duplicate:
                hexagons.append({
                    "contour": cnt,
                    "center": (cX, cY),
                    "area": area
                })

    print(f"Identified {len(hexagons)} potential hexagons.")
    
    # Fallback if detection failed
    if len(hexagons) < 10:
        print("Detection failed to find 10 hexagons. Generating fallback grid...")
        hexagons = []
        # Generate a 3-4-3 grid or similar
        # Image is 1024x546
        # Let's assume 3 rows
        rows = [3, 4, 3]
        hex_height = img.shape[0] // 3
        hex_width = hex_height # roughly
        
        y_offset = hex_height // 2
        
        count = 0
        for r, num_cols in enumerate(rows):
            x_step = img.shape[1] // (num_cols + 1)
            for c in range(num_cols):
                if count >= 10: break
                
                cx = x_step * (c + 1)
                cy = y_offset + r * hex_height
                
                # Create a dummy contour for cropping
                # Just a box around the center
                w = hex_width
                h = hex_height
                x = max(0, cx - w//2)
                y = max(0, cy - h//2)
                
                # Create a box contour
                cnt = np.array([[[x, y]], [[x+w, y]], [[x+w, y+h]], [[x, y+h]]], dtype=np.int32)
                
                hexagons.append({
                    "contour": cnt,
                    "center": (cx, cy),
                    "area": w*h
                })
                count += 1
    
    # Sort hexagons by Y then X to have a consistent order
    hexagons.sort(key=lambda h: (h["center"][1], h["center"][0]))
    
    ensure_dir(OUTPUT_DIR)
    ensure_dir(os.path.dirname(DATA_OUTPUT_PATH))
    
    layout_data = []
    
    for i, hex_data in enumerate(hexagons):
        cnt = hex_data["contour"]
        x, y, w, h = cv2.boundingRect(cnt)
        
        # Add padding
        padding = 10
        x = max(0, x - padding)
        y = max(0, y - padding)
        w = min(img.shape[1] - x, w + 2 * padding)
        h = min(img.shape[0] - y, h + 2 * padding)
        
        # Crop
        roi = img[y:y+h, x:x+w]
        
        # Create mask for transparency (simple circle/hex mask if we generated it, or contour mask)
        mask = np.zeros(roi.shape[:2], dtype=np.uint8)
        
        if len(hex_data.get("contour", [])) > 4: # Real contour
             cnt_roi = cnt - np.array([x, y])
             cv2.drawContours(mask, [cnt_roi], -1, 255, -1)
        else: # Fallback box
             cv2.rectangle(mask, (0,0), (w,h), 255, -1)

        
        # Create BGRA image
        b, g, r = cv2.split(roi)
        rgba = cv2.merge([b, g, r, mask])
        
        filename = f"hex_{i+1:02d}.png"
        output_path = os.path.join(OUTPUT_DIR, filename)
        cv2.imwrite(output_path, rgba)
        
        layout_data.append({
            "id": f"region_{i+1:02d}",
            "image": f"/maps/hexes/{filename}",
            "x": hex_data["center"][0],
            "y": hex_data["center"][1],
            "width": w,
            "height": h
        })
        print(f"Saved {filename}")

    # Save JSON layout
    with open(DATA_OUTPUT_PATH, 'w') as f:
        json.dump(layout_data, f, indent=2)
    
    print(f"Saved layout data to {DATA_OUTPUT_PATH}")

if __name__ == "__main__":
    process_map()
