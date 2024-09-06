import express from 'express';
import { createPersonalizedPassword } from "../controller/passwordController.js";
import { createSimplePassword } from '../controller/passwordController.js';
import { createAlphanumericPassword } from "../controller/passwordController.js";
import { createComplexPassword } from "../controller/passwordController.js";
import { authenticateJWT } from '../controller/authController.js';

const router = express.Router();

router.get('/simple/:length/:type', authenticateJWT, createSimplePassword);

router.get('/alphanumeric/:length/:type', authenticateJWT, createAlphanumericPassword);

router.get('/complex/:length/:type', authenticateJWT, createComplexPassword);

router.post('/personalized/:length/:type', authenticateJWT, createPersonalizedPassword);

export default router;

 