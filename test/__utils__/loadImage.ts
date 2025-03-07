import path from 'path';
import fs from 'fs';

export async function loadImage() {
  const imagePath = path.join(__dirname, '../__images__/test-image.jpeg');
  const buffer = fs.readFileSync(imagePath).buffer;
  return new Uint8Array(buffer).buffer;
}
