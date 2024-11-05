import express from 'express'
import multer from 'multer'
import path from 'path'
import { createImgSlide, deleteImgSlide, getImgSlide, getImgSlideById, updateImgSlide } from '../controller/imgSlideControllers.js'
import { verifyUser } from '../middleware/AuthUser.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router()

const sanitizeFileName = (name) => name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-\.]/g, '');

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image-slide');
  },
  filename: function (req, file, cb) {
    const baseName = sanitizeFileName(path.basename(file.originalname, path.extname(file.originalname)));
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const newFilename = `${baseName}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});

const fileFilter = function (req, file, cb) {
  
  if (file.mimetype.startsWith('image/') && file.fieldname === 'image') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('image');


router.get ('/imgslide',getImgSlide)
router.get ('/imgslide/:id',getImgSlideById)
router.post ('/imgslide',verifyUser,adminOnly,upload, createImgSlide)
router.patch ('/imgslide/:id',verifyUser,upload,updateImgSlide)
router.delete ('/imgslide/:id',verifyUser,adminOnly,deleteImgSlide)

export default router