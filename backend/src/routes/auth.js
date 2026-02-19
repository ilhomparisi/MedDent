import express from 'express';
import { login, getSession, logout } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/session', authenticateAdmin, getSession);
router.post('/logout', authenticateAdmin, logout);

export default router;
