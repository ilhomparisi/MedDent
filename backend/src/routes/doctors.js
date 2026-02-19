import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorOrder
} from '../controllers/doctorsController.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.post('/', authenticateAdmin, createDoctor);
router.put('/:id', authenticateAdmin, updateDoctor);
router.patch('/:id/order', authenticateAdmin, updateDoctorOrder);
router.delete('/:id', authenticateAdmin, deleteDoctor);

export default router;
