const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const climateRoutes = require('./routes/climateRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api', climateRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'HEATSCAPE AI Node Core',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`[HEATSCAPE SERVER] Node.js Express server running on port ${PORT}`);
});
