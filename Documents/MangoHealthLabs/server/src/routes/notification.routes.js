import { Router } from 'express'; import { requireAuth } from '../middleware/authMiddleware.js'; import * as controller from '../controllers/notification.controller.js';
const router = Router(); router.use(requireAuth); router.get('/', controller.list); export default router;
