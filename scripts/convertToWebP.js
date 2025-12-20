#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Function to convert image to WebP while maintaining aspect ratio
async function convertToWebP(inputPath, outputPath, quality = 85) {
  try {
    const info = await sharp(inputPath)
      .webp({ quality, effort: 6 })
      .toFile(outputPath);
    
    console.log(`✅ Converted: ${inputPath} -> ${outputPath}`);
    console.log(`   Size: ${info.width}x${info.height}, Format: ${info.format}`);
    return info;
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return null;
  }
}

// Function to process directory recursively
async function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      
      // Convert JPEG, JPG, PNG to WebP
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const nameWithoutExt = path.basename(item, ext);
        const outputPath = path.join(dirPath, `${nameWithoutExt}.webp`);
        
        // Skip if WebP already exists
        if (!fs.existsSync(outputPath)) {
          await convertToWebP(fullPath, outputPath);
          
          // Optional: Remove original file after conversion
          // fs.unlinkSync(fullPath);
          // console.log(`🗑️  Removed original: ${fullPath}`);
        } else {
          console.log(`⏭️  Skipped (WebP exists): ${fullPath}`);
        }
      }
    }
  }
}

// Main execution
async function main() {
  console.log('🔄 Converting images to WebP format...');
  console.log('📁 Processing public/images directory...');
  
  try {
    await processDirectory('public/images');
    console.log('✅ WebP conversion complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update image references from .jpg/.png to .webp');
    console.log('2. Test the website to ensure all images load correctly');
    console.log('3. Remove original files if everything works properly');
  } catch (error) {
    console.error('❌ Error during conversion:', error);
  }
}

// Check if sharp is installed and run main
main().catch(error => {
  console.error('❌ Error during conversion:', error);
});