import fs from 'node:fs';
import Report from '../models/Report.js';
import Booking from '../models/Booking.js';
import { createReport } from '../services/report.service.js';
import { reportSchema } from '../validators/schemas.js';
import { success, failure } from '../utils/response.js';
export async function list(req, res) { const filter = req.user.role === 'PATIENT' ? { patientId: req.user._id } : {}; return success(res, 'Reports fetched', { reports: await Report.find(filter).populate('bookingId testId').sort({ generatedAt: -1 }) }); }
export async function create(req, res) { const parsed = reportSchema.safeParse(req.body); if (!parsed.success) return failure(res, 'Invalid report data', parsed.error.issues, 400); const report = await createReport(parsed.data); return success(res, 'Report generated', { report }, 201); }
export async function download(req, res) { const report = await Report.findById(req.params.id); if (!report) return failure(res, 'Report not found', [], 404); if (req.user.role === 'PATIENT' && String(report.patientId) !== String(req.user._id)) return failure(res, 'You do not have access to this report', [], 403); if (!fs.existsSync(report.reportPath)) return failure(res, 'Report file is unavailable', [], 404); return res.download(report.reportPath, pathSafeName(report.reportPath)); }
const pathSafeName = (value) => value.split('/').pop();
