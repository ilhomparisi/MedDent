import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getSectionBackgrounds,
  getSectionBackground,
  updateSectionBackground,
  deleteSectionBackground
} from '../controllers/sectionBackgroundsController.js';

const router = express.Router();

router.get('/', getSectionBackgrounds);
router.get('/:section_name', getSectionBackground);
router.put('/:section_name', authenticateAdmin, updateSectionBackground);
router.delete('/:section_name', authenticateAdmin, deleteSectionBackground);

export default router;
