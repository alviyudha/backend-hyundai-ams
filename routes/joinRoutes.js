import express from 'express'
import { getAllModelDataByTrimID, getModelDetailAll, getModelDetailByType, getModelTrim, getModelTrimById, getModelTrimByIdTrim } from '../controller/JoinControllers.js';



const router = express.Router();


router.get('/modeldetail',getModelDetailAll)
router.get('/modeldetail/:typecar', getModelDetailByType);
router.get('/alldatamodel/:trimid', getAllModelDataByTrimID);
router.get('/modeltrim',getModelTrim)
router.get('/modeltrim/:uuid',getModelTrimById)
router.get('/modeltrim/trim/:trimid',getModelTrimByIdTrim)
export default router;