import express from 'express';
import {
  getAllPresets,
  getPresetById,
  createPreset,
  applyPreset,
  updatePreset,
  deletePreset
} from '../controllers/presetsController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/', authenticateAdmin, getAllPresets);
router.get('/:id', authenticateAdmin, getPresetById);
router.post('/', authenticateAdmin, createPreset);
router.post('/:id/apply', authenticateAdmin, applyPreset);
router.put('/:id', authenticateAdmin, updatePreset);
router.delete('/:id', authenticateAdmin, deletePreset);

export default router;
