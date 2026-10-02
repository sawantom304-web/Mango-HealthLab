import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Authentication required', errors: [] });
    const payload = verifyToken(header.slice(7));
    const user = await User.findById(payload.userId).select('+passwordHash');
    if (!user || !user.active) return res.status(401).json({ success: false, message: 'Account is inactive or unavailable', errors: [] });
    req.user = user;
    next();
  } catch { res.status(401).json({ success: false, message: 'Invalid or expired token', errors: [] }); }
}
