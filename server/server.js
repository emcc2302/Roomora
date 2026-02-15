import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './configs/db.js';
// import { Server } from 'socket.io';
// import { router } from './routes.js';

connectDB();
const app = express();
app.use(cors());// Enable CORS for all routes
app.get('/', (req, res) => {
    res.send('Api is running fine');
});

const PORT= process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});