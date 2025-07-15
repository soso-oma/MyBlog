import cloudinary from './cloudinaryConfig.js'; // Import configured Cloudinary instance
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // Import Cloudinary storage engine for multer

// Seting up multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary, 
  params: {
    folder: 'profile_pictures', 
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

export { cloudinary, storage }; // Export both for use in routes/middleware
