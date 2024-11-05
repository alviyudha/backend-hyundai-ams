import express from 'express'
import multer from 'multer'
import path from 'path'
import { createSpecification, deleteSpecification, getSpecification, getSpecificationByid, getSpecificationEV, getSpecificationEVbyid, updateSpecification  } from '../controller/specificationControllers.js';
import { verifyUser } from '../middleware/AuthUser.js';
import { adminOnly } from '../middleware/adminOnly.js';

 
const router = express.Router();

const sanitizeFileName = (name) => name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-\.]/g, '');

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image-view');
  },
  filename: function (req, file, cb) {
    const baseName = sanitizeFileName(path.basename(file.originalname, path.extname(file.originalname)));
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const newFilename = `${baseName}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});

const fileFilter = function (req, file, cb) {
  
  if (file.mimetype.startsWith('image/') && file.fieldname === 'imgView') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('imgView');


router.get('/specification',getSpecification)
router.get('/specificationEV',getSpecificationEV)
router.get('/specificationEV/:id',getSpecificationEVbyid)
router.get('/specification/:id',getSpecificationByid)
router.post('/specification',upload,createSpecification)
router.patch('/specification/:id',upload,updateSpecification )
router.delete('/specification/:id',deleteSpecification)

export default router