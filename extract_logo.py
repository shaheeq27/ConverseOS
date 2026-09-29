import cv2
import numpy as np

# Load the image
img = cv2.imread('/Users/shaheeq.s/.gemini/antigravity/brain/dfc69572-51c8-4b53-b89e-3b51521226db/.user_uploaded/media_1790683657792.jpg')

# Icon only (Dark)
# Source: x = 65 to 285, y = 45 to 270
icon_img = img[45:270, 65:285]
icon_bg = np.array([8, 8, 12]) # approximate dark background color in BGR

# Create an alpha channel based on difference from background
diff = np.abs(icon_img.astype(np.int16) - icon_bg.astype(np.int16))
alpha = np.max(diff, axis=2)
# Enhance alpha
alpha = np.clip(alpha * 2.5, 0, 255).astype(np.uint8)

# Add alpha channel
icon_rgba = cv2.cvtColor(icon_img, cv2.COLOR_BGR2BGRA)
icon_rgba[:, :, 3] = alpha

# Premultiply un-premultiply trick to clean edges
# Or simply output
cv2.imwrite('public/logo-icon.png', icon_rgba)

# Full logo (Dark)
# Source: x = 60 to 760, y = 40 to 275
full_img = img[40:275, 60:760]
diff_full = np.abs(full_img.astype(np.int16) - icon_bg.astype(np.int16))
alpha_full = np.max(diff_full, axis=2)
alpha_full = np.clip(alpha_full * 2.5, 0, 255).astype(np.uint8)
full_rgba = cv2.cvtColor(full_img, cv2.COLOR_BGR2BGRA)
full_rgba[:, :, 3] = alpha_full
cv2.imwrite('public/logo-full.png', full_rgba)

print("Extracted raster logos.")
