import mongoose from 'mongoose';

const parameterSchema = new mongoose.Schema({ name: String, unit: String, normalRange: String, refMin: Number, refMax: Number }, { _id: false });
const testSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  preparation: String,
  sampleType: String,
  turnaroundHours: Number,
  parameters: [parameterSchema],
  active: { type: Boolean, default: true }
}, { timestamps: true });
testSchema.index({ name: 'text', category: 'text' });
export default mongoose.model('Test', testSchema);
