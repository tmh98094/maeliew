import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all image files
function findImageFiles(dir, imageFiles = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImageFiles(filePath, imageFiles);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      imageFiles.push(filePath);
    }
  }
  
  return imageFiles;
}

// Function to convert image to WebP
async function convertToWebP(inputPath) {
  const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // Skip if WebP already exists
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping ${inputPath} - WebP already exists`);
    return outputPath;
  }
  
  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`🔄 Converting ${inputPath} (${metadata.width}x${metadata.height})`);
    
    await sharp(inputPath)
      .webp({ 
        quality: 85, // High quality
        effort: 6   // Maximum compression effort
      })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Converted: ${path.basename(outputPath)} (${savings}% smaller)`);
    return outputPath;
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return null;
  }
}

// Main conversion function
async function convertAllImages() {
  console.log('🚀 Starting WebP conversion...\n');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const imageFiles = findImageFiles(publicDir);
  
  console.log(`📁 Found ${imageFiles.length} image files to convert\n`);
  
  let converted = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const imagePath of imageFiles) {
    const result = await convertToWebP(imagePath);
    if (result) {
      converted++;
    } else if (fs.existsSync(imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp'))) {
      skipped++;
    } else {
      errors++;
    }
  }
  
  console.log('\n📊 Conversion Summary:');
  console.log(`✅ Converted: ${converted} files`);
  console.log(`⏭️  Skipped: ${skipped} files`);
  console.log(`❌ Errors: ${errors} files`);
  console.log('\n🎉 WebP conversion complete!');
}

// Run the conversion
convertAllImages().catch(console.error);