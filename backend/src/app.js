const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const idCardRoutes = require('./routes/idCardRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // For base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', chatRoutes);
app.use('/api/idcard', idCardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Chat Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;