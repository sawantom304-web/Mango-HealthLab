import mongoose from 'mongoose';
const resultSchema = new mongoose.Schema({ parameter: String, value: Number, unit: String, refMin: Number, refMax: Number, flag: { type: String, enum: ['LOW', 'NORMAL', 'HIGH'] } }, { _id: false });
const reportSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  results: [resultSchema], status: { type: String, enum: ['DRAFT', 'READY'], default: 'DRAFT' }, reportPath: String, generatedAt: Date
}, { timestamps: true });
export default mongoose.model('Report', reportSchema);
