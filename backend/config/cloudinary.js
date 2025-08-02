import cloudinary from './cloudinaryConfig.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary'; 

// Seting up multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary, 
  params: {
    folder: 'profile_pictures', 
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

export { cloudinary, storage }; 
