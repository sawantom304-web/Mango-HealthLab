import mongoose from 'mongoose';
const schema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, channel: { type: String, enum: ['EMAIL', 'IN_APP'], default: 'IN_APP' }, type: String, title: String, message: String, status: String, sentAt: Date }, { timestamps: true });
export default mongoose.model('Notification', schema);
