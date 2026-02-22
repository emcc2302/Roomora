//Function to check availability of a room
import Booking from "../models/bookong.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
const checkAvailability = async (checkInDate, checkOutDate,room) => {
    try{
        const bookings = await Booking.find({
            room: room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
            // status: { $ne: 'cancelled' }
        });
        const isAvailable = bookings.length === 0;
         return isAvailable;
    }catch(error){
        throw new Error(error.message);
    }
    
}

//api to check availability of a room 
//  POST /api/booking/check-availability
export const checkRoomAvailabilityAPI = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room } = req.body;
        const isAvailable = await checkAvailability(checkInDate, checkOutDate, room);
        res.json({ success: true, isAvailable });
    }catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//api to create a new booking
//  POST /api/booking/book
export const createBooking = async (req, res) => {
    try {
        //Before creating a booking, we need to check the availability of the room for the selected dates
        const { room, hotel, checkInDate, checkOutDate, guests} = req.body;
        const user =req.user._id;

        const isAvailable = await checkAvailability(checkInDate, checkOutDate, room);
        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Room is not available for the selected dates" });
        }

        //Calculate total price for the booking
        const roomData = await Room.findById(room);
        const timeDiff = Math.abs(new Date(checkOutDate).getTime() - new Date(checkInDate).getTime());
        const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const totalPrice = numberOfNights * roomData.pricePerNight;

        const booking = await Booking.create({
            user,
            room,
            hotel:roomData.hotel._id,
            checkInDate,
            checkOutDate,
            totalPrice,
            guests: +guests,
        });
        res.json({ success: true, message: "Booking created successfully", booking });
    }

    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }   
};

//api to get all bookings of a user
// GET /api/booking/my-bookings
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate("room hotel").sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//api to get booings of a perticular hotel owner
// GET /api/booking/owner-bookings
export const getHotelBookings = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.auth.userId });

        if(!hotelData){
            return res.status(404).json({ success: false, message: "Hotel not found for the owner" });
        }
        const bookings = await Booking.find({ hotel: hotelData._id}).populate("room user").sort({ createdAt: -1 });
        //total bookings for the hotel owner
        const totalBookings = bookings.length;

        //total revenue for the hotel owner
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);


        res.json({ success: true, 
            dashboard: {
                totalBookings,
                totalRevenue,
                 bookings
            }
            
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
