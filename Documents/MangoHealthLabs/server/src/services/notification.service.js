import Notification from '../models/Notification.js';
import { env } from '../config/env.js';
import nodemailer from 'nodemailer';

export async function recordNotification({ userId, bookingId, type, title, message, email }) {
  const hasSmtp = env.smtp.host && env.smtp.user && env.smtp.pass;
  const notification = await Notification.create({ userId, bookingId, channel: hasSmtp ? 'EMAIL' : 'IN_APP', type, title, message, status: hasSmtp ? 'PENDING' : 'SKIPPED', sentAt: hasSmtp ? undefined : new Date() });
  if (hasSmtp) {
    const transporter = nodemailer.createTransport({ host: env.smtp.host, port: env.smtp.port, secure: env.smtp.port === 465, auth: { user: env.smtp.user, pass: env.smtp.pass } });
    try { await transporter.sendMail({ from: env.smtp.from, to: email, subject: title, text: message }); notification.status = 'SENT'; notification.sentAt = new Date(); await notification.save(); } catch { notification.status = 'FAILED'; await notification.save(); }
  }
  return notification;
}
