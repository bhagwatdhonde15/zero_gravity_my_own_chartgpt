import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Zero Gravity Bot',
    version: '3.0.0 Pro SaaS',
    timestamp: new Date().toISOString()
  });
});

// Telemetry API
app.get('/api/telemetry', (req, res) => {
  res.json({
    activeSessions: 1,
    modelsAvailable: ['deepseek-r1-distill-llama-70b', 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
    status: 'healthy'
  });
});

// Serve static frontend files from /dist
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use(express.static(__dirname));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('====================================================');
  console.log('🚀 Zero Gravity Bot Full-Stack Server Active!');
  console.log(`👉 Frontend & Backend Running at: http://localhost:${PORT}`);
  console.log('====================================================');
});
