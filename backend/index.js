const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const educationRoutes = require('./routes/education');
const adminRoutes = require('./routes/adminRoutes');
const recycleRoutes = require('./routes/recycle');
const app = express();
const port = 5000;

connectToMongo();

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
  });
app.use('/api/auth', authRoutes);
app.use('/api', eventsRoutes);
app.use('/admin', adminRoutes);
app.use('/api', educationRoutes);
app.use('/api', recycleRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
