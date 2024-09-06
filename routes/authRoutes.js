import express from 'express';
import { registerUser, loginUser } from '../controller/authController.js';
import { limiterLogin } from '../middlewares/rateLimit.js';
import { limiterRegister } from '../middlewares/rateLimit.js';

const router = express.Router();

router.post('/register', limiterRegister, registerUser);
router.post('/login', limiterLogin, loginUser);

export default router;