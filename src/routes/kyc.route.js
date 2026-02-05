import express from 'express';
import { initiateKYCController, getKYCStatusController, webhookController } from '../controllers/kyc.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/initiate', isAuthenticated, initiateKYCController);
router.get('/status', isAuthenticated, getKYCStatusController);

// Webhook route (public, but should be secured)
router.post('/webhook', webhookController);

export default router;