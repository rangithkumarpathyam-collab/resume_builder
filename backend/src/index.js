require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');

const app = express();

// Connect to MongoDB (Optional for exports, but keeps health check alive)
connectDB().catch(err => console.log('Database optional for stateless exports'));

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable for easier testing in dev
}));
app.use(cors({
  origin: '*', // Allow all origins for the redesigned guest app
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: 'guest' });
});

// Routes
app.use('/api/resumes', resumeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.'
  });
});

const PORT = process.env.PORT || 5000;

// Only start listener when not in serverless (Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Resume Builder API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
