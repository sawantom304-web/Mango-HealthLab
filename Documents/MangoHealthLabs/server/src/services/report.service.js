import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import Booking from '../models/Booking.js';
import Report from '../models/Report.js';

export async function createReport(input) {
  const booking = await Booking.findById(input.bookingId).populate('patientId').populate('labId');
  if (!booking) { const e = new Error('Booking not found'); e.status = 404; throw e; }
  const results = input.results.map(item => ({ ...item, flag: item.refMin != null && item.value < item.refMin ? 'LOW' : item.refMax != null && item.value > item.refMax ? 'HIGH' : 'NORMAL' }));
  const dir = path.resolve('server/reports'); fs.mkdirSync(dir, { recursive: true }); const filename = `${booking.bookingCode}_Report.pdf`; const filePath = path.join(dir, filename);
  await new Promise((resolve, reject) => { const doc = new PDFDocument({ margin: 48 }); const stream = fs.createWriteStream(filePath); stream.on('finish', resolve); stream.on('error', reject); doc.pipe(stream); doc.fontSize(22).fillColor('#103B37').text('Mango HealthLab'); doc.moveDown().fontSize(16).text('Diagnostic Report'); doc.fontSize(11).fillColor('#5B716C').text(`Booking ${booking.bookingCode} | Patient ${booking.patientId.name}`); doc.moveDown(); results.forEach(result => doc.fillColor('#103B37').text(`${result.parameter}: ${result.value} ${result.unit}  (${result.flag})`)); doc.end(); });
  const report = await Report.create({ bookingId: booking._id, patientId: booking.patientId._id, testId: input.testId, results, status: 'READY', reportPath: filePath, generatedAt: new Date() });
  booking.status = 'REPORT_READY'; booking.reportReadyAt = new Date(); await booking.save(); return report;
}
