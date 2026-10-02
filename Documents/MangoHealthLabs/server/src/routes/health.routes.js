import { Router } from 'express';
import mongoose from 'mongoose';
import { success } from '../utils/response.js';

const router = Router();
router.get('/', (req, res) => success(res, 'Mango HealthLab API is healthy', { database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
export default router;
