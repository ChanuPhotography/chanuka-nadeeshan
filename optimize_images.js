/**
 * optimize_images.js - Image Optimization Script
 * 
 * This script uses 'sharp' to resize and compress images in the Photos directory.
 * It targets large images (>2MB) and converts them to smaller, web-friendly versions.
 * 
 * INSTRUCTIONS:
 * 1. Open a terminal in this project directory.
 * 2. Run: npm install sharp
 * 3. Run: node optimize_images.js
 */

const fs = require('fs');
const path = require('path');

// Target directory
const photosDir = path.join(__dirname, 'Photos');

// Try to load sharp
let sharp;
try {
    sharp = require('sharp');
} catch (err) {
    console.error('Error: "sharp" is not installed.');
    console.error('Please run "npm install sharp" first.');
    process.exit(1);
}

// Function to process a directory recursively
async function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await processDir(fullPath);
        } else if (entry.isFile() && /\.(jpg|jpeg|png)$/i.test(entry.name)) {
            const stats = fs.statSync(fullPath);
            const sizeMB = stats.size / (1024 * 1024);

            // Only process images larger than 1MB or if they are extremely high resolution
            if (sizeMB > 1) {
                console.log(`Optimizing: ${fullPath} (${sizeMB.toFixed(2)} MB)`);
                
                try {
                    const buffer = fs.readFileSync(fullPath);
                    const image = sharp(buffer);
                    const metadata = await image.metadata();

                    // If image is wider than 2000px, resize it
                    if (metadata.width > 2000) {
                        await image
                            .resize(2000) // Max width 2000px
                            .jpeg({ quality: 80, mozjpeg: true }) // Good compression
                            .toFile(fullPath + '.tmp');
                    } else {
                        // Just compress
                        await image
                            .jpeg({ quality: 80, mozjpeg: true })
                            .toFile(fullPath + '.tmp');
                    }

                    // Replace original with optimized version
                    fs.unlinkSync(fullPath);
                    fs.renameSync(fullPath + '.tmp', fullPath);
                    
                    const newStats = fs.statSync(fullPath);
                    const newSizeMB = newStats.size / (1024 * 1024);
                    console.log(`   -> Success! New size: ${newSizeMB.toFixed(2)} MB`);
                } catch (err) {
                    console.error(`   -> Failed to optimize ${entry.name}: ${err.message}`);
                }
            }
        }
    }
}

console.log('--- Starting Image Optimization ---');
processDir(photosDir).then(() => {
    console.log('--- Optimization Complete ---');
}).catch(err => {
    console.error('Fatal Error:', err);
});
