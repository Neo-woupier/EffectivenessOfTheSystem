const express = require('express');
const cors = require('cors');
const surveyRoutes = require('./routes/survey');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/survey', surveyRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ระบบประเมินความพึงพอใจ API — พร้อมใช้งาน', status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
