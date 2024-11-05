import express from 'express'
import multer from 'multer';
import path from 'path'
import { createColor, deleteColor, getColor, getColorbyId, getColorbyModelID, getColorWithModel, getSelectColorsByTrimId, updateColor } from '../controller/colorsControllers.js';
import { verifyUser } from '../middleware/AuthUser.js';
import { adminOnly } from '../middleware/adminOnly.js';





const router = express.Router();

const sanitizeFileName = (name) => name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-\.]/g, '');

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/cars-color');
  },
  filename: function (req, file, cb) {
    const baseName = sanitizeFileName(path.basename(file.originalname, path.extname(file.originalname)));
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const newFilename = `${baseName}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});

const fileFilter = function (req, file, cb) {
  
  if (file.mimetype.startsWith('image/') && file.fieldname === 'colorsImage') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('colorsImage');

router.get('/color',getColor)
router.get('/colormodel',getColorWithModel)
router.get('/color/:id',getColorbyId)
router.get('/color/model/:model',getColorbyModelID)
router.get('/color/trim/:trimid',getSelectColorsByTrimId)
router.post('/color/',verifyUser,adminOnly,upload,createColor)
router.delete('/color/:id',verifyUser,adminOnly,deleteColor)
router.patch('/color/:id',verifyUser,upload,updateColor)

export default router