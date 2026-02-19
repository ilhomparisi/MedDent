import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/servicesController.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', authenticateAdmin, createService);
router.put('/:id', authenticateAdmin, updateService);
router.delete('/:id', authenticateAdmin, deleteService);

export default router;
