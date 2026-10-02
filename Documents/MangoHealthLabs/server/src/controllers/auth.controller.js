import User from '../models/User.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { success, failure } from '../utils/response.js';

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role });
export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body); if (!parsed.success) return failure(res, 'Please check your registration details', parsed.error.issues, 400);
  if (await User.exists({ email: parsed.data.email.toLowerCase() })) return failure(res, 'An account with this email already exists', [], 409);
  const user = await User.create({ ...parsed.data, email: parsed.data.email.toLowerCase(), passwordHash: await hashPassword(parsed.data.password) });
  return success(res, 'Account created successfully', { user: publicUser(user), token: signToken(user) }, 201);
}
export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body); if (!parsed.success) return failure(res, 'Enter a valid email and password', parsed.error.issues, 400);
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select('+passwordHash');
  if (!user || !user.active || !(await comparePassword(parsed.data.password, user.passwordHash))) return failure(res, 'Email or password is incorrect', [], 401);
  return success(res, 'Welcome back', { user: publicUser(user), token: signToken(user) });
}
export async function me(req, res) { return success(res, 'Authenticated user', { user: publicUser(req.user) }); }
