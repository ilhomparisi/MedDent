import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewsController.js';

const router = express.Router();

router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.post('/', authenticateAdmin, createReview);
router.put('/:id', authenticateAdmin, updateReview);
router.delete('/:id', authenticateAdmin, deleteReview);

export default router;
