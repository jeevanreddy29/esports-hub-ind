const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load .env from the backend directory (works locally; on Vercel, env vars come from dashboard)
dotenv.config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const tournamentRoutes = require('./routes/tournaments');
const chatRoutes = require('./routes/chat');
const leaderboardRoutes = require('./routes/leaderboard');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Initialize database only once (not on every serverless cold start re-import)
// Removed initDB() from here. It should be run manually via 'node backend/db/database.js'
// to prevent wiping the database and timing out Vercel serverless functions on cold start.

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Esports Hub India Backend Running!' });
});

// Local server start (not used in Vercel serverless)
if (require.main === module) {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/:path*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API endpoint not found' });
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
  app.listen(PORT, () => {
    console.log(`🎮 Esports Hub India Backend running on port ${PORT}`);
  });
}

module.exports = app;
