import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getFinalCTA,
  updateFinalCTA
} from '../controllers/finalCTAController.js';

const router = express.Router();

router.get('/', getFinalCTA);
router.put('/', authenticateAdmin, updateFinalCTA);

export default router;
