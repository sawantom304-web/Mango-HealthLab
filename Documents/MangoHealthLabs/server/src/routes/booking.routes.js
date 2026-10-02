import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/requireRole.js';
import * as controller from '../controllers/booking.controller.js';
const router = Router();
router.use(requireAuth); router.post('/', controller.create); router.get('/', controller.list); router.get('/:id', controller.get); router.put('/:id/status', controller.status); router.put('/:id/assign', requireRole('ADMIN'), controller.assign); router.delete('/:id', controller.cancel);
export default router;
