const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const educationRoutes = require('./routes/education');
const adminRoutes = require('./routes/adminRoutes');
const recycleRoutes = require('./routes/recycle');
const historyRoutes = require('./routes/history');
const profileRoutes = require('./routes/profile');
const dashboardRoutes = require('./routes/dashboard');
const rewardRoutes = require('./routes/reward');
const app = express();
const port = 5000;

connectToMongo();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
  });
app.use('/auth', authRoutes);
app.use('/api', eventsRoutes);
app.use('/admin', adminRoutes);
app.use('/api', educationRoutes);
app.use('/api', recycleRoutes);
app.use('/api', historyRoutes);
app.use('/api', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rewards', rewardRoutes);

// Error handling for JSON parsing
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Catch-all for API routes to ensure JSON response
app.use('/api/*', (req, res) => {
  console.log('404 for path:', req.path);
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

