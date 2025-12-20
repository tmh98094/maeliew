import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all code files
function findCodeFiles(dir, codeFiles = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(file)) {
      findCodeFiles(filePath, codeFiles);
    } else if (/\.(tsx?|jsx?|ts|js|md)$/i.test(file)) {
      codeFiles.push(filePath);
    }
  }
  
  return codeFiles;
}

// Function to update image references in a file
function updateImageReferences(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Pattern to match image references
    const patterns = [
      // Standard image paths
      /(['"`])([^'"`]*\/images\/[^'"`]*\.(jpg|jpeg|png))(['"`])/gi,
      // URL patterns
      /(url\(['"`]?)([^'"`\)]*\/images\/[^'"`\)]*\.(jpg|jpeg|png))(['"`]?\))/gi,
      // src attributes
      /(src\s*=\s*['"`])([^'"`]*\/images\/[^'"`]*\.(jpg|jpeg|png))(['"`])/gi,
      // Background image CSS
      /(background-image:\s*url\(['"`]?)([^'"`\)]*\/images\/[^'"`\)]*\.(jpg|jpeg|png))(['"`]?\))/gi
    ];
    
    patterns.forEach(pattern => {
      content = content.replace(pattern, (match, prefix, imagePath, extension, suffix) => {
        const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        updated = true;
        return prefix + webpPath + suffix;
      });
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Main update function
function updateAllReferences() {
  console.log('🚀 Starting image reference updates...\n');
  
  const rootDir = path.join(__dirname, '..');
  const codeFiles = findCodeFiles(rootDir);
  
  console.log(`📁 Found ${codeFiles.length} code files to check\n`);
  
  let updatedFiles = 0;
  
  for (const filePath of codeFiles) {
    if (updateImageReferences(filePath)) {
      updatedFiles++;
    }
  }
  
  console.log(`\n📊 Update Summary:`);
  console.log(`✅ Updated files: ${updatedFiles}`);
  console.log(`📁 Total files checked: ${codeFiles.length}`);
  console.log('\n🎉 Image reference updates complete!');
}

// Run the update
updateAllReferences();