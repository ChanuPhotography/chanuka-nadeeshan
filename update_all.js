const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const photosDir = path.join(baseDir, 'Photos');

const categories = {};
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

const folders = fs.readdirSync(photosDir).filter(f => fs.statSync(path.join(photosDir, f)).isDirectory());
folders.sort();

for (const folder of folders) {
    let catClass = folder.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let caption = folder.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    if (folder.toLowerCase() === 'comm') {
        caption = 'Commercial';
        catClass = 'comm';
    } else if (folder.toLowerCase() === 'convercation') {
        caption = 'Convocation';
        catClass = 'convercation';
    } else if (folder.toLowerCase() === 'engagemnt') {
        caption = 'Engagement';
        catClass = 'engagemnt';
    }
    
    categories[folder] = { catClass, caption };
}

const filterBtns = ['                <button class="filter-btn active" data-filter="all">All</button>'];
for (const folder of folders) {
    const { catClass, caption } = categories[folder];
    filterBtns.push(`                <button class="filter-btn" data-filter="${catClass}">${caption}</button>`);
}
const filterHtml = filterBtns.join('\n');

const homeItems = [];
const galleryItems = [];

for (const folder of folders) {
    const catDir = path.join(photosDir, folder);
    const { catClass, caption } = categories[folder];
    
    const allFiles = fs.readdirSync(catDir);
    let files = allFiles.filter(f => allowedExtensions.includes(path.extname(f).toLowerCase()));
    files.sort();
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let relPath = `Photos/${folder}/${file}`.replace(/\\/g, '/');
        
        const gSnippet = `                <div class="gallery-grid-item ${catClass} animate-on-scroll fade-up" data-bs-toggle="modal" data-bs-target="#lightboxModal"
                    data-bs-img="${relPath}" data-bs-caption="${caption}">
                    <img loading="lazy" decoding="async" src="${relPath}" alt="${catClass}">
                    <i class="fas fa-search-plus overlay-icon"></i>
                </div>`;
        galleryItems.push(gSnippet);
        
        if (i < 6) {
            const featuredClass = i < 2 ? ' featured' : '';
            const hSnippet = `                <div class="gallery-grid-item ${catClass}${featuredClass} animate-on-scroll fade-up" data-bs-toggle="modal"
                    data-bs-target="#lightboxModal" data-bs-img="${relPath}" data-bs-caption="${caption}">
                    <img loading="lazy" decoding="async" src="${relPath}" alt="${catClass}">
                    <i class="fas fa-search-plus overlay-icon"></i>
                </div>`;
            homeItems.push(hSnippet);
        }
    }
}

const homeHtml = homeItems.join('\n');
const galleryHtmlItems = galleryItems.join('\n');

// Read and Update index.html
const indexPath = path.join(baseDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

indexContent = indexContent.replace(
    /(<!-- Filter Buttons -->\s*<div class="filter-container[^>]*>).*?(<\/div>\s*<!-- Masonry Grid Layout -->)/s,
    `$1\n${filterHtml}\n            $2`
);

indexContent = indexContent.replace(
    /(<div class="gallery-masonry" id="homeGalleryContainer">).*?(<\/div>\s*<div class="text-center mt-5">)/s,
    `$1\n${homeHtml}\n            $2`
);

fs.writeFileSync(indexPath, indexContent, 'utf8');

// Read and Update gallery.html
const gallPath = path.join(baseDir, 'gallery.html');
let gallContent = fs.readFileSync(gallPath, 'utf8');

gallContent = gallContent.replace(
    /(<!-- Filter Buttons -->\s*<div class="filter-container[^>]*>).*?(<\/div>\s*<!-- Masonry Grid Layout -->)/s,
    `$1\n${filterHtml}\n            $2`
);

gallContent = gallContent.replace(
    /(<div class="gallery-masonry" id="galleryContainer">).*?(<\/div>\s*<\/div>\s*<\/section>)/s,
    `$1\n${galleryHtmlItems}\n            $2`
);

fs.writeFileSync(gallPath, gallContent, 'utf8');

console.log(`Update completed. Home updated with ${homeItems.length} items. Gallery updated with ${galleryItems.length} items.`);
