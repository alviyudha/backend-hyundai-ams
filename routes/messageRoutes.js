import express from 'express'
import { createMessageUser, deleteMessageUser, getMessageUser, getMessageUserById, updateMessageUser } from '../controller/messageController.js';
import { verifyUser } from '../middleware/AuthUser.js';
import { adminOnly } from '../middleware/adminOnly.js';



const router = express.Router();
router.get('/messageuser',getMessageUser)
router.get('/messageuser/:id',getMessageUserById)
router.post('/messageuser',createMessageUser)
router.patch('/messageuser/:id',verifyUser,updateMessageUser)
router.delete('/messageuser/:id',verifyUser,adminOnly,deleteMessageUser)




export default router;