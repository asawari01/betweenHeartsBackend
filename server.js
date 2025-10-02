import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import geminiRoutes from './routes/geminiRoutes.js'
import https from 'https';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// MiddleWare
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Use the routes
app.use('/api', geminiRoutes);

// simple welcome route
app.get('/', (req, res) => {
    res.send('Welcome to gemini API backend');
});

// start the server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is running on PORT${PORT}`);
});