import { app } from '../src/app.js';
import { connectDatabase } from '../src/config/db.js';

let databaseConnection;

export default async function handler(req, res) {
  try {
    databaseConnection ??= connectDatabase().catch(error => {
      databaseConnection = undefined;
      throw error;
    });
    await databaseConnection;
    return app(req, res);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    return res.status(503).json({
      success: false,
      message: 'Mango HealthLab API is not connected to its database yet',
      errors: []
    });
  }
}
