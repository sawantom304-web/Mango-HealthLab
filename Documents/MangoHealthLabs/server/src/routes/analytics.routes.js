import { Router } from 'express'; import { requireAuth } from '../middleware/authMiddleware.js'; import { requireRole } from '../middleware/requireRole.js'; import { overview } from '../controllers/analytics.controller.js';
const router = Router(); router.get('/overview', requireAuth, requireRole('ADMIN'), overview); export default router;
