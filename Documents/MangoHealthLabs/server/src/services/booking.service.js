import Booking from '../models/Booking.js';
import Test from '../models/Test.js';
import Lab from '../models/Lab.js';
import { bookingSchema } from '../validators/schemas.js';
import { failure } from '../utils/response.js';

function code() { const date = new Date().toISOString().slice(0, 10).replaceAll('-', ''); return `MLH-${date}-${Math.floor(1000 + Math.random() * 9000)}`; }
export const allowedTransitions = { PENDING: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['COLLECTION_ASSIGNED', 'SAMPLE_COLLECTED', 'CANCELLED'], COLLECTION_ASSIGNED: ['SAMPLE_COLLECTED'], SAMPLE_COLLECTED: ['PROCESSING'], PROCESSING: ['REPORT_READY'], REPORT_READY: ['COMPLETED'], COMPLETED: [], CANCELLED: [] };
export async function createBooking(input, user) {
  const parsed = bookingSchema.safeParse(input); if (!parsed.success) { const e = new Error('Please complete the booking details'); e.status = 400; e.errors = parsed.error.issues; throw e; }
  const data = parsed.data; if (data.collectionType === 'HOME' && (!data.address || !data.contactNumber)) { const e = new Error('Home collection requires an address and contact number'); e.status = 400; throw e; }
  const date = new Date(`${data.appointmentDate}T23:59:59`); if (Number.isNaN(date.valueOf()) || date < new Date()) { const e = new Error('Choose a future appointment date'); e.status = 400; throw e; }
  const [tests, lab] = await Promise.all([Test.find({ _id: { $in: data.testIds }, active: true }), Lab.findOne({ _id: data.labId, active: true })]);
  if (tests.length !== data.testIds.length || !lab) { const e = new Error('Selected test or lab is not available'); e.status = 400; throw e; }
  if (data.collectionType === 'HOME' && !lab.homeCollectionAvailable) { const e = new Error('Home collection is not available at this lab'); e.status = 400; throw e; }
  const duplicate = await Booking.findOne({ patientId: user._id, appointmentDate: data.appointmentDate, appointmentTime: data.appointmentTime, testIds: { $in: data.testIds }, status: { $ne: 'CANCELLED' } }); if (duplicate) { const e = new Error('You already have a booking for this test and slot'); e.status = 409; throw e; }
  const booked = await Booking.countDocuments({ labId: lab._id, appointmentDate: data.appointmentDate, appointmentTime: data.appointmentTime, status: { $ne: 'CANCELLED' } }); if (booked >= 5) { const e = new Error('This slot is full'); e.status = 409; throw e; }
  return Booking.create({ ...data, patientId: user._id, testIds: tests.map(t => t._id), items: tests.map(t => ({ testId: t._id, name: t.name, price: t.price })), totalAmount: tests.reduce((sum, t) => sum + t.price, 0), bookingCode: code(), status: 'CONFIRMED' });
}
