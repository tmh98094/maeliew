#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function fixImagePathsInFile(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(/\/public\/images\//g, '/images/');
    
    if (content !== updatedContent) {
      writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Fixed image paths in: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
}

function processDirectory(dirPath: string): void {
  const items = readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .git directories
      if (!item.startsWith('.') && item !== 'node_modules') {
        processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      // Process TypeScript, JavaScript, and TSX files
      if (item.match(/\.(ts|tsx|js|jsx)$/)) {
        fixImagePathsInFile(fullPath);
      }
    }
  }
}

console.log('🔧 Fixing image paths from /images/ to /images/...');
processDirectory('.');
console.log('✅ Image path fixing complete!');