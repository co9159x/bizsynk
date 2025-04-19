/**
 * This script provides instructions for updating the app icon.
 * 
 * To use this script:
 * 1. Install the required packages: npm install sharp
 * 2. Run this script: node update-app-icon.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the sizes for different densities
const sizes = {
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192
};

// Define the paths for the icon files
const iconPaths = {
  'ic_launcher': 'public/app-icon.svg',
  'ic_launcher_foreground': 'public/app-icon-foreground.svg',
  'ic_launcher_round': 'public/app-icon.svg'
};

// Function to convert SVG to PNG
async function convertSvgToPng(svgPath, pngPath, size) {
  try {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    console.log(`Created ${pngPath}`);
  } catch (error) {
    console.error(`Error converting ${svgPath} to ${pngPath}:`, error);
  }
}

// Main function to update the app icons
async function updateAppIcons() {
  console.log('Updating app icons...');
  
  // Create the output directories if they don't exist
  for (const density of Object.keys(sizes)) {
    const dir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', `mipmap-${density}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  
  // Convert each icon to PNG in different sizes
  for (const [iconName, svgPath] of Object.entries(iconPaths)) {
    for (const [density, size] of Object.entries(sizes)) {
      const fullSvgPath = path.join(__dirname, svgPath);
      const pngPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', `mipmap-${density}`, `${iconName}.png`);
      await convertSvgToPng(fullSvgPath, pngPath, size);
    }
  }
  
  console.log('App icons updated successfully!');
}

// Run the main function
updateAppIcons().catch(console.error); 