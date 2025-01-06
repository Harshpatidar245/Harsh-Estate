// backend/routes/upload.route.js
import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 5MB limit
  }
}).array('images', 6); // Allow up to 6 images

router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: `Unknown error: ${err.message}`
      });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      // Upload all images to Cloudinary
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype};base64,${b64}`;
          
          cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
            folder: 'estate-listings',
            timeout: 60000,
            transformation: [{
              quality: 'auto',
              fetch_format: 'auto'
            }]
          }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          });
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      res.json({
        success: true,
        urls: uploadedUrls
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading to Cloudinary'
      });
    }
  });
});

export default router;
