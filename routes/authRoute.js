import express from 'express';
import { register, loginUser, handleRefreshtoken, logout, updatePassword, forgotPasswordToken, resetPassword } from '../controller/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);
router.post('/forgot-password-token', forgotPasswordToken);

router.get('/logout', authMiddleware, logout);
router.get('/refresh', handleRefreshtoken);

router.put('/password', authMiddleware, updatePassword);
router.put('/reset-password/:token', resetPassword);


export default router;