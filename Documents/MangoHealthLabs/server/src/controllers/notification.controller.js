import Notification from '../models/Notification.js';
import { success } from '../utils/response.js';
export async function list(req, res) { return success(res, 'Notifications fetched', { notifications: await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30) }); }
