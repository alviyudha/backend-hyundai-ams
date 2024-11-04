import express from 'express'
// import multer from 'multer';
// import path from 'path'; 
import { createVehicles, deletetVehicles, getVehicles, getVehiclesByID, getVehiclesByModel, updateVehicles } from '../controller/modelsControllers.js'
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';



const router = express.Router();

// const sanitizeFileName = (name) => name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-\.]/g, '');

// const fileStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.fieldname === 'backgroundImg') {
//       cb(null, 'public/images');
//     } else if (file.fieldname === 'brochure') {
//       cb(null, 'public/pdf');
//     }
//     else if (file.fieldname === 'warrantyImg'){
//         cb(null, 'public/warranty');
//     }
//   },
//   filename: function (req, file, cb) {
//     const baseName = sanitizeFileName(path.basename(file.originalname, path.extname(file.originalname)));
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const newFilename = `${baseName}-${uniqueSuffix}${path.extname(file.originalname)}`;
//     cb(null, newFilename);
//   }
// });

// const fileFilter = function (req, file, cb) {
//   if (file.mimetype === 'application/pdf' && file.fieldname === 'brochure') {
//     cb(null, true);
//   } else if (file.mimetype.startsWith('image/') && file.fieldname === 'backgroundImg') {
//     cb(null, true);
//   } else if (file.mimetype.startsWith('image/') && file.fieldname === 'warrantyImg'){
//     cb(null, true);
//   } 
//   else {
//     cb(new Error('Invalid file type'), false);
//   }
// };

// const upload = multer({
//   storage: fileStorage,
//   fileFilter: fileFilter
// }).fields([{ name: 'backgroundImg', maxCount: 1 }, { name: 'brochure', maxCount: 1 },{ name: 'warrantyImg', maxCount: 1 }]);



router.get('/vehicles',getVehicles)
router.get('/vehicles/:id',getVehiclesByID)
router.get('/vehicles/model/:model', getVehiclesByModel);
router.post('/vehicles',verifyUser,adminOnly,createVehicles)
router.patch('/vehicles/:id',verifyUser,updateVehicles)
router.delete('/vehicles/:id',verifyUser,adminOnly,deletetVehicles)
router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'api berhasil',
    });
});


export default router;