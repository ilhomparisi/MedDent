import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import {
  getAllPillSections,
  createPillSection,
  updatePillSection,
  deletePillSection,
  getAllValueItems,
  createValueItem,
  updateValueItem,
  deleteValueItem,
  getAllCampaigns,
  getCampaignByCode,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  incrementCampaignClick,
  getAllCRMUsers,
  createCRMUser,
  updateCRMUser,
  deleteCRMUser,
  crmLogin
} from '../controllers/miscController.js';

const router = express.Router();

// Pill Sections - public read, protected write
router.get('/pill-sections', getAllPillSections);
router.post('/pill-sections', authenticateAdmin, createPillSection);
router.put('/pill-sections/:id', authenticateAdmin, updatePillSection);
router.delete('/pill-sections/:id', authenticateAdmin, deletePillSection);

// Value Stacking - public read, protected write
router.get('/value-items', getAllValueItems);
router.post('/value-items', authenticateAdmin, createValueItem);
router.put('/value-items/:id', authenticateAdmin, updateValueItem);
router.delete('/value-items/:id', authenticateAdmin, deleteValueItem);

// Campaigns - public read, protected write
router.get('/campaigns', getAllCampaigns);
router.get('/campaigns/:code', getCampaignByCode);
router.post('/campaigns', authenticateAdmin, createCampaign);
router.put('/campaigns/:id', authenticateAdmin, updateCampaign);
router.delete('/campaigns/:id', authenticateAdmin, deleteCampaign);
router.post('/campaigns/increment-click', incrementCampaignClick);

// CRM Users
router.get('/crm-users', authenticateAdmin, getAllCRMUsers);
router.post('/crm-users', authenticateAdmin, createCRMUser);
router.put('/crm-users/:id', authenticateAdmin, updateCRMUser);
router.delete('/crm-users/:id', authenticateAdmin, deleteCRMUser);
router.post('/crm-login', crmLogin);

export default router;
