import os
import re

base_dir = r"c:\Users\mihir\OneDrive\Documents\Photograper website"

# 1. Optimize styles.css
style_path = os.path.join(base_dir, "style.css")
with open(style_path, "r", encoding="utf-8") as f:
    css_content = f.read()

# Remove will-change completely
css_content = re.sub(r'\s*will-change:[^;]+;', '', css_content)

# Simplify service-card transition to ignore border-color and box-shadow to prevent lag,
# or just keep it since we removed will-change (let's keep transform and opacity)
css_content = re.sub(
    r'transition:\s*transform[^,]+,\s*box-shadow[^,]+,\s*border-color[^;]+;',
    r'transition: transform 0.6s var(--ease-smooth);',
    css_content
)

css_content = re.sub(
    r'transition:\s*transform[^,]+,\s*background-color[^,]+,\s*box-shadow[^;]+;',
    r'transition: transform 0.5s var(--ease-smooth), background-color 0.5s var(--ease-smooth);',
    css_content
)

# 2. Optimize index.html
index_path = os.path.join(base_dir, "index.html")
with open(index_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# Add decoding="async" if not present
html_content = re.sub(r'(<img\s[^>]*?loading="lazy")[^>]*?>', lambda m: m.group(0).replace('loading="lazy"', 'loading="lazy" decoding="async"') if 'decoding="async"' not in m.group(0) else m.group(0), html_content)


# 3. Optimize gallery.html
gallery_path = os.path.join(base_dir, "gallery.html")
if os.path.exists(gallery_path):
    with open(gallery_path, "r", encoding="utf-8") as f:
        gallery_content = f.read()
    
    gallery_content = re.sub(r'(<img\s[^>]*?loading="lazy")[^>]*?>', lambda m: m.group(0).replace('loading="lazy"', 'loading="lazy" decoding="async"') if 'decoding="async"' not in m.group(0) else m.group(0), gallery_content)
    
    with open(gallery_path, "w", encoding="utf-8") as f:
        f.write(gallery_content)

# Save changes
with open(style_path, "w", encoding="utf-8") as f:
    f.write(css_content)

with open(index_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Optimization complete.")
