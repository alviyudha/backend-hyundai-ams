import express from 'express'
import multer from 'multer'
import path from 'path'
import { createDealer, deleteDealer, getDealer, getDealerByid, updateDealer } from '../controller/dealerControllers.js'
import { adminOnly, verifyUser } from '../middleware/AuthUser.js'


const router = express.Router()

const sanitizeFileName = (name) => name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-\.]/g, '');

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/dealer');
  },
  filename: function (req, file, cb) {
    const baseName = sanitizeFileName(path.basename(file.originalname, path.extname(file.originalname)));
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const newFilename = `${baseName}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  }
});

const fileFilter = function (req, file, cb) {
  
  if (file.mimetype.startsWith('image/') && file.fieldname === 'imgDealer') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('imgDealer');


router.get('/dealer',getDealer)
router.get('/dealer/:id',getDealerByid)
router.post('/dealer',verifyUser,adminOnly,upload,createDealer)
router.patch('/dealer/:id',verifyUser,upload,updateDealer )
router.delete('/dealer/:id',verifyUser,adminOnly,deleteDealer)

export default router
