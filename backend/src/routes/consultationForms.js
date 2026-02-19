import express from 'express';
import {
  createForm,
  getForms,
  getSources,
  updateForm,
  getFormById
} from '../controllers/consultationController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public endpoint - no auth required
router.post('/', createForm);

// Protected endpoints - require admin auth
router.get('/', authenticateAdmin, getForms);
router.get('/sources', authenticateAdmin, getSources);
router.get('/:id', authenticateAdmin, getFormById);
router.patch('/:id', authenticateAdmin, updateForm);

export default router;
