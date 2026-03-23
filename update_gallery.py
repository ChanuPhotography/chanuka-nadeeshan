import os
import glob
import re

base_dir = r"c:\Users\mihir\OneDrive\Documents\Photograper website"
photos_dir = os.path.join(base_dir, "Photos")

categories = {
    "baby": "Baby",
    "birthday": "Birthday",
    "comm": "Commercial",
    "convercation": "Convocation",
    "engagemnt": "Engagement",
    "event": "Events",
    "wedding": "Wedding"
}

html_snippets = []

for category, caption in categories.items():
    cat_dir = os.path.join(photos_dir, category)
    if not os.path.exists(cat_dir):
        continue
    
    files = []
    for ext in ('*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG'):
        files.extend(glob.glob(os.path.join(cat_dir, ext)))
    
    for f in files:
        filename = os.path.basename(f)
        rel_path = f"Photos/{category}/{filename}"
        
        snippet = f"""                <div class="gallery-grid-item {category} animate-on-scroll fade-up" data-bs-toggle="modal" data-bs-target="#lightboxModal"
                    data-bs-img="{rel_path}"
                    data-bs-caption="{caption}">
                    <img loading="lazy" src="{rel_path}"
                        alt="{category}">
                    <i class="fas fa-search-plus overlay-icon"></i>
                </div>"""
        html_snippets.append(snippet)

gallery_html_path = os.path.join(base_dir, "gallery.html")
with open(gallery_html_path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(r'(<div class="gallery-masonry" id="galleryContainer">)(.*?)(            </div>\s*</div>\s*</section>)', re.DOTALL)
new_content = pattern.sub(r'\1\n' + '\n'.join(html_snippets) + r'\n\3', content)

with open(gallery_html_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Updated gallery.html with {len(html_snippets)} images.")
