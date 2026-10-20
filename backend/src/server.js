import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configurations and Drivers
import { connectDB } from './config/db.js';
import User from './models/User.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import docRoutes from './routes/docRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading local file uploads statically on frontend
}));

app.use(cors({
  origin: '*', // Allows access from any port (e.g. Vite dev port 5173)
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads
const publicDir = path.join(__dirname, '..', 'public');
const uploadsDir = path.join(publicDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Route Mountings
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/documents', docRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Premium Portfolio API is active and running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(`💥 Server Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred'
  });
});

// Seed admin function
const seedAdminUser = async () => {
  try {
    const adminCount = await User.countDocuments({});
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const email = process.env.ADMIN_EMAIL || 'admin@portfolio.dev';
      const password = process.env.ADMIN_PASSWORD || 'adminpassword123';
      
      await User.create({
        username,
        email,
        password // The authController handles encrypting this plain-text on first login
      });
      console.log('✅ Default administrator seeded successfully!');
      console.log(`👤 Username: ${username}`);
      console.log(`✉️ Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
    }
  } catch (err) {
    console.error('⚠️ Seeding admin failed:', err.message);
  }
};

// Start Server and Database
const startServer = async () => {
  await connectDB();
  await seedAdminUser();

  app.listen(PORT, () => {
    console.log(`⚡ Express Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
export default app;
