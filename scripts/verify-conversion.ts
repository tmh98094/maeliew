import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images');

const FILES = [
  'desktophero1.jpeg',
  'desktophero2.jpeg',
  'mobilehero1.jpeg',
  'mobilehero2.jpeg',
];

async function verifyAndConvert() {
  console.log(`Checking directory: ${PUBLIC_DIR}`);
  if (!fs.existsSync(PUBLIC_DIR)) {
      console.error('Directory does not exist!');
      return;
  }
  
  const files = fs.readdirSync(PUBLIC_DIR);
  console.log('Files in directory:', files.filter(f => f.includes('hero')));

  for (const file of FILES) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const outputPath = path.join(PUBLIC_DIR, file.replace('.jpeg', '.webp'));

    if (fs.existsSync(outputPath)) {
        console.log(`[OK] ${path.basename(outputPath)} exists.`);
    } else {
        console.log(`[MISSING] ${path.basename(outputPath)}. converting...`);
        if (fs.existsSync(inputPath)) {
            try {
                await sharp(inputPath)
                  .webp({ quality: 80 })
                  .toFile(outputPath);
                console.log(`[SUCCESS] Converted ${file}`);
            } catch (error) {
                console.error(`[ERROR] Failed to convert ${file}:`, error);
            }
        } else {
            console.error(`[ERROR] Input file not found: ${file}`);
        }
    }
  }
}

verifyAndConvert();
