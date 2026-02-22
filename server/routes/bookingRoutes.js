import express from "express";
import { checkRoomAvailabilityAPI } from "../controllers/bookingController.js";
import { createBooking } from "../controllers/bookingController.js";
import { getUserBookings, getHotelBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";


const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkRoomAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);






export default bookingRouter;