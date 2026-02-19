import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentsController.js';

const router = express.Router();

router.get('/', authenticateAdmin, getAppointments);
router.get('/:id', authenticateAdmin, getAppointment);
router.post('/', createAppointment); // Public endpoint for booking
router.put('/:id', authenticateAdmin, updateAppointment);
router.delete('/:id', authenticateAdmin, deleteAppointment);

export default router;
