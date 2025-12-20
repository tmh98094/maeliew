#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Function to update image references in a file
function updateImageReferences(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Replace .jpg, .jpeg, .png with .webp in image paths
    const patterns = [
      /\/images\/[^"'\s)]+\.jpe?g/gi,
      /\/images\/[^"'\s)]+\.png/gi,
      /images\/[^"'\s)]+\.jpe?g/gi,
      /images\/[^"'\s)]+\.png/gi
    ];
    
    patterns.forEach(pattern => {
      const newContent = content.replace(pattern, (match) => {
        const webpPath = match.replace(/\.(jpe?g|png)$/i, '.webp');
        if (webpPath !== match) {
          updated = true;
          console.log(`  📝 ${match} -> ${webpPath}`);
        }
        return webpPath;
      });
      content = newContent;
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Function to process directory recursively
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let totalUpdated = 0;
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .git directories
      if (!item.startsWith('.') && item !== 'node_modules') {
        totalUpdated += processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      // Process TypeScript, JavaScript, TSX, JSX files
      if (item.match(/\.(ts|tsx|js|jsx)$/)) {
        if (updateImageReferences(fullPath)) {
          totalUpdated++;
        }
      }
    }
  }
  
  return totalUpdated;
}

// Main execution
function main() {
  console.log('🔄 Updating image references to WebP format...');
  
  const totalUpdated = processDirectory('.');
  
  console.log(`\n✅ Update complete! ${totalUpdated} files updated.`);
  console.log('\n📝 Files updated with WebP references:');
  console.log('- All .jpg, .jpeg, .png references in /images/ paths converted to .webp');
  console.log('- TypeScript, JavaScript, TSX, JSX files processed');
  console.log('\n⚠️  Manual check recommended:');
  console.log('- Verify all images load correctly');
  console.log('- Check for any hardcoded image URLs that might need updating');
}

main();