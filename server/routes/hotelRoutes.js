import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";
const HotelRouter = express.Router();

HotelRouter.post('/',protect,registerHotel);





export default HotelRouter;
