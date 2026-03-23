import os
import glob
import re

base_dir = r"c:\Users\mihir\OneDrive\Desktop\Final Web Photography\chanuka-nadeeshan"
photos_dir = os.path.join(base_dir, "Photos")

categories = {}
# Exclude known files/hidden folders if any
allowed_extensions = ('.jpg', '.jpeg', '.png', '.webp')

for folder in sorted(os.listdir(photos_dir)):
    cat_dir = os.path.join(photos_dir, folder)
    if os.path.isdir(cat_dir):
        cat_class = re.sub(r'[^a-zA-Z0-9]+', '-', folder.lower()).strip('-')
        caption = folder.replace('-', ' ').title()
        
        # Keep specific names if they previously had meaning, though title() works well
        # Some custom overrides based on original names
        if folder.lower() == 'comm':
             caption = 'Commercial'
             cat_class = 'comm'
        elif folder.lower() == 'convercation':
             caption = 'Convocation'
             cat_class = 'convercation'
        elif folder.lower() == 'engagemnt':
             caption = 'Engagement'
             cat_class = 'engagemnt'
        
        categories[folder] = (cat_class, caption)

filter_btns = ['                <button class="filter-btn active" data-filter="all">All</button>']
for folder, (cat_class, caption) in categories.items():
    filter_btns.append(f'                <button class="filter-btn" data-filter="{cat_class}">{caption}</button>')
filter_html = '\n'.join(filter_btns)

home_items = []
gallery_items = []

for folder in sorted(os.listdir(photos_dir)):
    cat_dir = os.path.join(photos_dir, folder)
    if not os.path.isdir(cat_dir):
        continue
    
    cat_class, caption = categories[folder]
    
    files = []
    for ext in allowed_extensions:
        files.extend(glob.glob(os.path.join(cat_dir, '*' + ext)))
        files.extend(glob.glob(os.path.join(cat_dir, '*' + ext.upper())))
        
    # Remove duplicates on cases
    files = list(set(files))
    # Sort files to ensure stable order
    files = sorted(files)
    
    for i, f in enumerate(files):
        filename = os.path.basename(f)
        rel_path = f"Photos/{folder}/{filename}"
        rel_path = rel_path.replace("\\", "/") # fix path separators for web
        
        g_snippet = f"""                <div class="gallery-grid-item {cat_class} animate-on-scroll fade-up" data-bs-toggle="modal" data-bs-target="#lightboxModal"
                    data-bs-img="{rel_path}" data-bs-caption="{caption}">
                    <img loading="lazy" decoding="async" src="{rel_path}" alt="{cat_class}">
                    <i class="fas fa-search-plus overlay-icon"></i>
                </div>"""
        gallery_items.append(g_snippet)
        
        if i < 6:
            featured_class = " featured" if i < 2 else ""
            h_snippet = f"""                <div class="gallery-grid-item {cat_class}{featured_class} animate-on-scroll fade-up" data-bs-toggle="modal"
                    data-bs-target="#lightboxModal" data-bs-img="{rel_path}" data-bs-caption="{caption}">
                    <img loading="lazy" decoding="async" src="{rel_path}" alt="{cat_class}">
                    <i class="fas fa-search-plus overlay-icon"></i>
                </div>"""
            home_items.append(h_snippet)

home_html = '\n'.join(home_items)
gallery_html_items = '\n'.join(gallery_items)

# Read and Update index.html
index_path = os.path.join(base_dir, "index.html")
with open(index_path, 'r', encoding='utf-8') as f:
    index_content = f.read()

index_content = re.sub(
    r'(<!-- Filter Buttons -->\s*<div class="filter-container[^>]*>).*?(</div>\s*<!-- Masonry Grid Layout -->)',
    r'\1\n' + filter_html + r'\n            \2',
    index_content,
    flags=re.DOTALL
)

index_content = re.sub(
    r'(<div class="gallery-masonry" id="homeGalleryContainer">).*?(</div>\s*<div class="text-center mt-5">)',
    r'\1\n' + home_html + r'\n            \2',
    index_content,
    flags=re.DOTALL
)

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(index_content)

# Read and Update gallery.html
gall_path = os.path.join(base_dir, "gallery.html")
with open(gall_path, 'r', encoding='utf-8') as f:
    gall_content = f.read()

gall_content = re.sub(
    r'(<!-- Filter Buttons -->\s*<div class="filter-container[^>]*>).*?(</div>\s*<!-- Masonry Grid Layout -->)',
    r'\1\n' + filter_html + r'\n            \2',
    gall_content,
    flags=re.DOTALL
)

gall_content = re.sub(
    r'(<div class="gallery-masonry" id="galleryContainer">).*?(</div>\s*</div>\s*</section>)',
    r'\1\n' + gallery_html_items + r'\n            \2',
    gall_content,
    flags=re.DOTALL
)

with open(gall_path, 'w', encoding='utf-8') as f:
    f.write(gall_content)

print(f"Update completed. Home updated with {len(home_items)} items. Gallery updated with {len(gallery_items)} items.")
