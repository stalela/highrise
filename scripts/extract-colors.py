from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import colorsys

img = Image.open('public/logo-1.jpeg').convert('RGB')
img_small = img.resize((200, 200))
pixels = np.array(img_small).reshape(-1, 3)

mask = ((pixels.max(axis=1) > 30) & (pixels.max(axis=1) < 245)) | (pixels.max(axis=1) - pixels.min(axis=1) > 15)
filtered = pixels[mask]

kmeans = KMeans(n_clusters=8, random_state=42, n_init=10)
kmeans.fit(filtered)
centers = kmeans.cluster_centers_.astype(int)
counts = np.bincount(kmeans.labels_)
sorted_idx = np.argsort(-counts)

print('Dominant colors:')
for i in sorted_idx:
    r, g, b = centers[i]
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    pct = counts[i] / len(filtered) * 100
    print(f'  #{r:02x}{g:02x}{b:02x}  rgb({r},{g},{b})  HSL({int(h*360)} {int(s*100)}% {int(l*100)}%)  {pct:.1f}%')
print(f'Size: {img.size}')
