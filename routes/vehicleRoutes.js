import express from 'express'
import { createVehicles, deletetVehicles, getVehicles, getVehiclesByID, getVehiclesByModel, updateVehicles } from '../controller/vehicleControllers.js'
import { verifyUser } from '../middleware/AuthUser.js';
import { adminOnly } from '../middleware/adminOnly.js';



const router = express.Router();


router.get('/vehicles',getVehicles)
router.get('/vehicles/:id',getVehiclesByID)
router.get('/vehicles/model/:model', getVehiclesByModel);
router.post('/vehicles',createVehicles)
router.patch('/vehicles/:id',updateVehicles)
router.delete('/vehicles/:id',deletetVehicles)
router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'api berhasil',
    });
});


export default router;