import express from 'express';
import {
  getAllSettings,
  getSettingByKey,
  upsertSetting,
  bulkUpdateSettings,
  deleteSetting
} from '../controllers/settingsController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/', authenticateAdmin, getAllSettings);
router.get('/:key', authenticateAdmin, getSettingByKey);
router.put('/:key', authenticateAdmin, upsertSetting);
router.post('/bulk', authenticateAdmin, bulkUpdateSettings);
router.delete('/:key', authenticateAdmin, deleteSetting);

export default router;
