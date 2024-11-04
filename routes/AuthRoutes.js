import express from 'express'
import { getLogin, login, logOut } from '../controller/Auth.js';



const router = express.Router();

router.post('/login', login);
router.get('/me', getLogin);
router.delete('/logout',logOut );

export default router;