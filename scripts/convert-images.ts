import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const ROOT_DIR = process.cwd();

// Assuming images are in the root public/images or directly in public?
// Based on file list, they are in 'public' directly for the hero images.
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const FILES_TO_CONVERT = [
  'desktophero1.jpeg',
  'desktophero2.jpeg',
  'mobilehero1.jpeg',
  'mobilehero2.jpeg',
];

async function convertImages() {
  console.log('Starting image conversion...');
  
  for (const file of FILES_TO_CONVERT) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const outputPath = path.join(PUBLIC_DIR, file.replace('.jpeg', '.webp'));

    if (fs.existsSync(inputPath)) {
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`Converted: ${file} -> ${path.basename(outputPath)}`);
      } catch (error) {
        console.error(`Error converting ${file}:`, error);
      }
    } else {
      console.warn(`File not found: ${file}`);
    }
  }
  
  // Also check for 'desjtophero3.webp' typo mentioned by user, though file list showed desktophero3.webp exists.
  // I will check if there are other jpegs in the folder matching the pattern just in case.
  const allFiles = fs.readdirSync(PUBLIC_DIR);
  const otherJpegs = allFiles.filter(f => f.endsWith('.jpeg') && (f.startsWith('desktophero') || f.startsWith('mobilehero')) && !FILES_TO_CONVERT.includes(f));
  
  for (const file of otherJpegs) {
     const inputPath = path.join(PUBLIC_DIR, file);
     const outputPath = path.join(PUBLIC_DIR, file.replace('.jpeg', '.webp'));
     if (!fs.existsSync(outputPath)) { // Only if not already converted
        try {
            await sharp(inputPath)
              .webp({ quality: 80 })
              .toFile(outputPath);
            console.log(`Converted extra file: ${file} -> ${path.basename(outputPath)}`);
        } catch (error) {
            console.error(`Error converting ${file}:`, error);
        }
     }
  }

  console.log('Conversion complete.');
}

convertImages();
