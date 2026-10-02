import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({ testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' }, name: String, price: Number }, { _id: false });
const bookingSchema = new mongoose.Schema({
  bookingCode: { type: String, unique: true, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
  items: [itemSchema],
  labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  collectionType: { type: String, enum: ['HOME', 'LAB'], required: true },
  address: String, contactNumber: String,
  appointmentDate: { type: String, required: true }, appointmentTime: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'COLLECTION_ASSIGNED', 'SAMPLE_COLLECTED', 'PROCESSING', 'REPORT_READY', 'COMPLETED', 'CANCELLED'], default: 'CONFIRMED' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalAmount: Number, sampleCollectedAt: Date, reportReadyAt: Date, cancelledAt: Date
}, { timestamps: true });
bookingSchema.index({ patientId: 1, appointmentDate: 1, appointmentTime: 1, status: 1 });
export default mongoose.model('Booking', bookingSchema);
