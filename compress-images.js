import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folder public yang berisi gambar-gambar Anda
const inputFolder = path.join(__dirname, 'public');
const outputFolder = path.join(__dirname, 'public_optimized');

// Daftar folder yang tidak ingin diproses
const excludedFolders = ['image-slide', 'images', 'warranty'];

// Fungsi untuk memproses gambar
const compressImage = async (filePath, outputFilePath) => {
  try {
    await sharp(filePath)
      .resize(800) // Mengatur lebar gambar menjadi 800px
      .toFormat('webp', { quality: 80 }) // Mengonversi gambar ke format webp dengan kualitas 80
      .toFile(outputFilePath);
    console.log(`Compressed and saved: ${outputFilePath}`);
  } catch (err) {
    console.error(`Error compressing image ${filePath}:`, err);
  }
};

// Fungsi untuk memproses folder secara rekursif
const processFolder = (folderPath) => {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const currentPath = path.join(folderPath, file);
    const stat = fs.lstatSync(currentPath);

    // Jika folder dan bukan folder yang dikecualikan, proses rekursif
    if (stat.isDirectory() && !excludedFolders.includes(file)) {
      processFolder(currentPath);
    } 
    // Jika file gambar
    else if (stat.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file)) {
      const outputFilePath = path.join(outputFolder, path.relative(inputFolder, currentPath));
      const outputDir = path.dirname(outputFilePath);

      // Pastikan direktori output ada
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Kompres gambar
      compressImage(currentPath, outputFilePath);
    }
  });
};

// Mulai pemrosesan gambar
processFolder(inputFolder);
