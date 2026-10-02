import { z } from 'zod';
export const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().min(8), password: z.string().min(8) });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const bookingSchema = z.object({ testIds: z.array(z.string()).min(1), labId: z.string(), collectionType: z.enum(['HOME', 'LAB']), appointmentDate: z.string(), appointmentTime: z.string(), address: z.string().optional(), contactNumber: z.string().optional() });
export const reportSchema = z.object({ bookingId: z.string(), testId: z.string(), results: z.array(z.object({ parameter: z.string(), value: z.coerce.number(), unit: z.string(), refMin: z.coerce.number().optional(), refMax: z.coerce.number().optional() })) });
