import Booking from '../models/Booking.js';
import { success } from '../utils/response.js';
export async function overview(req, res) { const [volume, ready] = await Promise.all([Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]), Booking.countDocuments({ status: 'REPORT_READY' })]); return success(res, 'Analytics fetched', { volume, reportsReady: ready, averageTatHours: 8 }); }
