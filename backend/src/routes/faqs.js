import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  updateFAQOrder
} from '../controllers/faqsController.js';

const router = express.Router();

router.get('/', getAllFAQs);
router.get('/:id', getFAQById);
router.post('/', authenticateAdmin, createFAQ);
router.put('/:id', authenticateAdmin, updateFAQ);
router.patch('/:id/order', authenticateAdmin, updateFAQOrder);
router.delete('/:id', authenticateAdmin, deleteFAQ);

export default router;
