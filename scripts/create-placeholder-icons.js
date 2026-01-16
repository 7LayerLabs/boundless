const fs = require('fs');
const path = require('path');

// Create minimal valid PNG files as placeholders
// These are solid dark brown squares matching the Boundless theme

// PNG signature
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function createPNG(width, height, r, g, b) {
  const chunks = [];

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);  // bit depth
  ihdr.writeUInt8(2, 9);  // color type (RGB)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  chunks.push(createChunk('IHDR', ihdr));

  // IDAT chunk (image data)
  const zlib = require('zlib');
  const rawData = Buffer.alloc((width * 3 + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 3 + 1);
    rawData[rowStart] = 0; // filter byte
    for (let x = 0; x < width; x++) {
      const pixelStart = rowStart + 1 + x * 3;
      rawData[pixelStart] = r;
      rawData[pixelStart + 1] = g;
      rawData[pixelStart + 2] = b;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  chunks.push(createChunk('IDAT', compressed));

  // IEND chunk
  chunks.push(createChunk('IEND', Buffer.alloc(0)));

  return Buffer.concat([PNG_SIGNATURE, ...chunks]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(data) {
  let crc = 0xffffffff;
  const table = makeCRCTable();

  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xff];
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function makeCRCTable() {
  const table = new Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Dark brown color from Boundless theme: #1a1714
const r = 0x1a, g = 0x17, b = 0x14;

// Generate 192x192 icon
const icon192 = createPNG(192, 192, r, g, b);
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), icon192);
console.log('Created icon-192x192.png');

// Generate 512x512 icon
const icon512 = createPNG(512, 512, r, g, b);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), icon512);
console.log('Created icon-512x512.png');

console.log('\nPlaceholder icons created! Replace with branded icons later.');
