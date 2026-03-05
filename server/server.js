import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebhooks.js';
import UserRouter from './routes/UserRoutes.js';
import HotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

// import { Server } from 'socket.io';
// import { router } from './routes.js';

connectDB();
connectCloudinary();
const app = express();
app.use(cors());// Enable CORS for all routes

app.use(express.json());
app.use(clerkMiddleware());

//API to listen to the webhook events from Clerk
// app.use("/api/clerk",clerkWebhooks)
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

app.get('/', (req, res) => {
    res.send('Api is running fine');
});
app.use('/api/user', UserRouter);
app.use('/api/hotels', HotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/booking', bookingRouter);


const PORT= process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});