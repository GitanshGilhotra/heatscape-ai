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

const server = app.listen(PORT, () => {
  console.log(`[HEATSCAPE SERVER] Node.js Express server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[HEATSCAPE SERVER ERROR] Port ${PORT} is already in use by another process.`);
    console.error(`To kill the process occupying port 5000 on Windows, run:\n   npx kill-port 5000\nOR in PowerShell:\n   Stop-Process -Name node -Force\n`);
    process.exit(1);
  } else {
    console.error('[HEATSCAPE SERVER ERROR]', err);
  }
});
