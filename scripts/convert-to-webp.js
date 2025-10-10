#!/usr/bin/env node

/**
 * Image Conversion Script
 * Converts PNG and JPG images in the public folder to WebP format
 * Usage: node scripts/convert-to-webp.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const PUBLIC_DIR = path.join(__dirname, '../public');
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg'];
const WEBP_QUALITY = 85; // 85% quality for good balance between size and quality

// Statistics
let stats = {
  converted: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  newSize: 0,
};

/**
 * Recursively find all image files in directory
 */
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Convert single image to WebP
 */
async function convertImage(imagePath) {
  try {
    const ext = path.extname(imagePath);
    const webpPath = imagePath.replace(ext, '.webp');

    // Skip if WebP version already exists
    if (fs.existsSync(webpPath)) {
      console.log(`⏭️  Skipping ${path.basename(imagePath)} (WebP already exists)`);
      stats.skipped++;
      return;
    }

    // Get original file size
    const originalSize = fs.statSync(imagePath).size;

    // Convert to WebP
    await sharp(imagePath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);

    // Get new file size
    const newSize = fs.statSync(webpPath).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${path.basename(imagePath)} → ${path.basename(webpPath)}`);
    console.log(`   ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savings}% smaller)`);

    stats.converted++;
    stats.originalSize += originalSize;
    stats.newSize += newSize;
  } catch (error) {
    console.error(`❌ Error converting ${path.basename(imagePath)}:`, error.message);
    stats.errors++;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Starting image conversion to WebP...\n');

  // Find all images
  const images = findImages(PUBLIC_DIR);
  console.log(`📁 Found ${images.length} images to process\n`);

  if (images.length === 0) {
    console.log('No images found to convert.');
    return;
  }

  // Convert each image
  for (const imagePath of images) {
    await convertImage(imagePath);
  }

  // Print summary
  console.log('\n📊 Conversion Summary:');
  console.log(`   ✅ Converted: ${stats.converted}`);
  console.log(`   ⏭️  Skipped: ${stats.skipped}`);
  console.log(`   ❌ Errors: ${stats.errors}`);

  if (stats.converted > 0) {
    const totalSavings = ((stats.originalSize - stats.newSize) / stats.originalSize * 100).toFixed(1);
    console.log(`   💾 Original size: ${(stats.originalSize / 1024).toFixed(1)}KB`);
    console.log(`   💾 New size: ${(stats.newSize / 1024).toFixed(1)}KB`);
    console.log(`   🎉 Total savings: ${totalSavings}% (${((stats.originalSize - stats.newSize) / 1024).toFixed(1)}KB)`);
  }

  console.log('\n✨ Done!');
  console.log('\n⚠️  Next steps:');
  console.log('   1. Update your code to use .webp extensions');
  console.log('   2. Test the images in your app');
  console.log('   3. If everything works, you can delete the original PNG/JPG files');
}

main().catch(console.error);
