import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebhooks.js';
// import { Server } from 'socket.io';
// import { router } from './routes.js';

connectDB();
const app = express();
app.use(cors());// Enable CORS for all routes

app.use(express.json());
app.use(clerkMiddleware());

//API to listen to the webhook events from Clerk
app.use("/api/clerk",clerkWebhooks)

app.get('/', (req, res) => {
    res.send('Api is running fine');
});

const PORT= process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});