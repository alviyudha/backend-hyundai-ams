import express from 'express'
import { createUser, deleteUser, getUser, getUserByCUID, updateUser } from '../controller/UserControllers.js';
import { verifyUser } from '../middleware/AuthUser.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();


router.get('/users',verifyUser,adminOnly,getUser)
router.get('/users/:cuid',verifyUser,adminOnly,getUserByCUID)
router.post('/users',verifyUser,adminOnly,createUser)
router.patch('/users/:cuid',verifyUser,adminOnly,updateUser)
router.delete('/users/:cuid',verifyUser,adminOnly,deleteUser)




export default router;