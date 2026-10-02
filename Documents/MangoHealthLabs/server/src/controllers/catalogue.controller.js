import mongoose from 'mongoose';
import Test from '../models/Test.js';
import Lab from '../models/Lab.js';
import Booking from '../models/Booking.js';
import { success, failure } from '../utils/response.js';

export async function listTests(req, res) {
  const filter = { active: req.query.active !== 'false' };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.$or = [{ name: new RegExp(req.query.search, 'i') }, { category: new RegExp(req.query.search, 'i') }];
  return success(res, 'Tests fetched', { tests: await Test.find(filter).sort({ category: 1, name: 1 }) });
}
export async function getTest(req, res) { if (!mongoose.isValidObjectId(req.params.id)) return failure(res, 'Test not found', [], 404); const test = await Test.findById(req.params.id); return test ? success(res, 'Test fetched', { test }) : failure(res, 'Test not found', [], 404); }
export async function createTest(req, res) { const test = await Test.create(req.body); return success(res, 'Test created', { test }, 201); }
export async function updateTest(req, res) { const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); return test ? success(res, 'Test updated', { test }) : failure(res, 'Test not found', [], 404); }
export async function deactivateTest(req, res) { const test = await Test.findByIdAndUpdate(req.params.id, { active: false }, { new: true }); return test ? success(res, 'Test deactivated', { test }) : failure(res, 'Test not found', [], 404); }

export async function listLabs(req, res) { const filter = { active: true }; if (req.query.city) filter.city = new RegExp(req.query.city, 'i'); return success(res, 'Labs fetched', { labs: await Lab.find(filter).sort({ city: 1 }) }); }
export async function getLab(req, res) { const lab = await Lab.findById(req.params.id); return lab ? success(res, 'Lab fetched', { lab }) : failure(res, 'Lab not found', [], 404); }
export async function createLab(req, res) { const lab = await Lab.create(req.body); return success(res, 'Lab created', { lab }, 201); }
export async function updateLab(req, res) { const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); return lab ? success(res, 'Lab updated', { lab }) : failure(res, 'Lab not found', [], 404); }
export async function deactivateLab(req, res) { const lab = await Lab.findByIdAndUpdate(req.params.id, { active: false }, { new: true }); return lab ? success(res, 'Lab deactivated', { lab }) : failure(res, 'Lab not found', [], 404); }
export async function slots(req, res) {
  const lab = await Lab.findById(req.params.id); if (!lab) return failure(res, 'Lab not found', [], 404);
  const date = req.query.date; if (!date) return failure(res, 'date is required', [], 400);
  const templates = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '16:00 - 17:00', '17:00 - 18:00'];
  const bookings = await Booking.find({ labId: lab._id, appointmentDate: date, status: { $ne: 'CANCELLED' } }).select('appointmentTime');
  const counts = bookings.reduce((acc, item) => ({ ...acc, [item.appointmentTime]: (acc[item.appointmentTime] || 0) + 1 }), {});
  return success(res, 'Slots fetched', { date, slots: templates.map(time => ({ time, capacity: 5, booked: counts[time] || 0, remaining: Math.max(0, 5 - (counts[time] || 0)) })) });
}
