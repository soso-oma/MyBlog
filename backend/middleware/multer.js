import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Setup __dirname for ES modules (since __dirname is not available by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the /uploads folder exists (create it if it doesn't)
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Configure multer disk storage
const storage = multer.diskStorage({
  // Set destination for uploaded files
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  // Rename uploaded files with fieldname + timestamp + original extension
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get original file extension
    cb(null, `${file.fieldname}-${Date.now()}${ext}`); // e.g., image-162234123.jpg
  },
});

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only image files are allowed'), false); // Reject non-image
  }
};

// Export configured multer instance with storage and filter
const upload = multer({ storage, fileFilter });

export default upload;
