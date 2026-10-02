import dotenv from 'dotenv';

dotenv.config();

export const env = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/healthlab',
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'mango-healthlab-development-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'reports@mangohealthlab.local'
  }
};
