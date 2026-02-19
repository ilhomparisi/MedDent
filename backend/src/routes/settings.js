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

// Public read access (needed by frontend to load site configuration)
router.get('/', getAllSettings);
router.get('/:key', getSettingByKey);

// Protected write access
router.put('/:key', authenticateAdmin, upsertSetting);
router.post('/bulk', authenticateAdmin, bulkUpdateSettings);
router.delete('/:key', authenticateAdmin, deleteSetting);

export default router;
