import mongoose from 'mongoose';

const labSchema = new mongoose.Schema({
  name: { type: String, required: true }, city: { type: String, required: true }, address: String,
  phone: String, email: String,
  operatingHours: { open: { type: String, default: '08:00' }, close: { type: String, default: '20:00' } },
  homeCollectionAvailable: { type: Boolean, default: true }, active: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Lab', labSchema);
