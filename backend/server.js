import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

import leaveRoutes from './routes/leaveRoutes.js';
import employeesRoutes from './routes/employeesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';

import { authenticate } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

import pool from './config/db.js';

app.locals.db = pool;


app.use(cors());
app.use(express.json());


app.use('/api/leave-requests', leaveRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/performance', performanceRoutes);


app.get('/api/protected-route', authenticate, (req, res) => {
  res.json({
    message: `Hello ${req.user.email}, you accessed a protected route! Your ID: ${req.user.id}`,
  });
});


app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

app.get('/', (req, res) => {
  res.send('Leave Management API is running!');
});


app.use((err, req, res, next) => {
  console.error('🔥 Global error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});


app.listen(PORT, async () => {
  try {
    await pool.getConnection();
    console.log('✅ Connected to MySQL database.');
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error.message);
    process.exit(1);
  }
});
