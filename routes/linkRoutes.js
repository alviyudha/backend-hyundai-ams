import express from 'express'
import { createLink, deleteLink, getLink, getLinkById, updateLink } from '../controller/linkControllers.js'
import { verifyUser } from '../middleware/AuthUser.js';
import { adminOnly } from '../middleware/adminOnly.js';


const router = express.Router()


router.get('/link',getLink)
router.get('/link/:id',getLinkById)
router.post('/link',createLink)
router.patch('/link/:id',updateLink)
router.delete('/link/:id',deleteLink)


export default router