import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/requireRole.js';
import * as controller from '../controllers/catalogue.controller.js';
const router = Router();
router.get('/tests', controller.listTests); router.get('/tests/:id', controller.getTest); router.post('/tests', requireAuth, requireRole('ADMIN'), controller.createTest); router.put('/tests/:id', requireAuth, requireRole('ADMIN'), controller.updateTest); router.delete('/tests/:id', requireAuth, requireRole('ADMIN'), controller.deactivateTest);
router.get('/labs', controller.listLabs); router.get('/labs/:id', controller.getLab); router.get('/labs/:id/slots', requireAuth, controller.slots); router.post('/labs', requireAuth, requireRole('ADMIN'), controller.createLab); router.put('/labs/:id', requireAuth, requireRole('ADMIN'), controller.updateLab); router.delete('/labs/:id', requireAuth, requireRole('ADMIN'), controller.deactivateLab);
export default router;
