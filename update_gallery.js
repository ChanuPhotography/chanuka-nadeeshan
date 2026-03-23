const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const photosDir = path.join(baseDir, 'Photos');

const categories = {
    baby: 'Baby',
    birthday: 'Birthday',
    comm: 'Commercial',
    convercation: 'Convocation',
    engagemnt: 'Engagement',
    event: 'Events',
    wedding: 'Wedding'
};

const fullHtmlSnippets = [];
const homeHtmlSnippets = [];

for (const [category, caption] of Object.entries(categories)) {
    const catDir = path.join(photosDir, category);
    if (!fs.existsSync(catDir)) continue;
    
    const files = fs.readdirSync(catDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    
    // Process all files for the gallery page
    for (const file of files) {
        const snippet = `                <div class="gallery-grid-item ${category} animate-on-scroll fade-up" data-bs-toggle="modal" data-bs-target="#lightboxModal"\n                    data-bs-img="${relPath}"\n                    data-bs-caption="${caption}">\n                    <img loading="lazy" src="${relPath}"\n                        alt="${category}">\n                    <i class="fas fa-search-plus overlay-icon"></i>\n                </div>`;
        fullHtmlSnippets.push(snippet);
    }
    
    // Process only first 2 files for the home page (index.html)
    const homeFiles = files.slice(0, 2);
    for (const file of homeFiles) {
        const snippet = `                <div class="gallery-grid-item ${category} animate-on-scroll fade-up" data-bs-toggle="modal" data-bs-target="#lightboxModal"\n                    data-bs-img="${relPath}"\n                    data-bs-caption="${caption}">\n                    <img loading="lazy" src="${relPath}"\n                        alt="${category}">\n                    <i class="fas fa-search-plus overlay-icon"></i>\n                </div>`;
        homeHtmlSnippets.push(snippet);
    }
}

// Update gallery.html using full array
function updateGalleryHtml(filename, containerId) {
    const htmlPath = path.join(baseDir, filename);
    let content = fs.readFileSync(htmlPath, 'utf8');
    const regex = new RegExp(`(<div class="gallery-masonry" id="${containerId}">)(.*?)(            </div>\\s*</div>\\s*</section>)`, 's');
    content = content.replace(regex, `$1\n${fullHtmlSnippets.join('\n')}\n$3`);
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`Updated ${filename} with ${fullHtmlSnippets.length} images.`);
}

// Update index.html using home array (max 5 per category)
function updateIndexHtml(filename, containerId) {
    const htmlPath = path.join(baseDir, filename);
    let content = fs.readFileSync(htmlPath, 'utf8');
    const regex = new RegExp(`(<div class="gallery-masonry" id="${containerId}">)(.*?)(            </div>\\s*<div class="text-center mt-5">)`, 's');
    content = content.replace(regex, `$1\n${homeHtmlSnippets.join('\n')}\n$3`);
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`Updated ${filename} with ${homeHtmlSnippets.length} images.`);
}

updateGalleryHtml('gallery.html', 'galleryContainer');
updateIndexHtml('index.html', 'homeGalleryContainer');
