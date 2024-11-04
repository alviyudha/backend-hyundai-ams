import express from 'express'
import { createLink, deleteLink, getLink, getLinkById, updateLink } from '../controller/linkControllers.js'
import { adminOnly, verifyUser } from '../middleware/AuthUser.js'


const router = express.Router()


router.get('/link',getLink)
router.get('/link/:id',getLinkById)
router.post('/link',verifyUser,adminOnly,createLink)
router.patch('/link/:id',verifyUser,updateLink)
router.delete('/link/:id',verifyUser,adminOnly,deleteLink)


export default router