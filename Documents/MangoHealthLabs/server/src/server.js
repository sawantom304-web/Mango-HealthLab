import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

try {
  await connectDatabase();
  app.listen(env.port, () => console.log(`Mango HealthLab API listening on http://localhost:${env.port}`));
} catch (error) {
  console.error(`MongoDB connection failed: ${error.message}`);
  process.exit(1);
}
