import express from 'express';
import { login, getMe, updateCredentials } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update', protect, updateCredentials);

export default router;
