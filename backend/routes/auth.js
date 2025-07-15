import express from 'express';
import {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/google-login', googleLogin);

export default router;
