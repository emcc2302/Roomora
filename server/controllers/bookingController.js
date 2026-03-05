import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// check availability helper
const checkAvailability = async (checkInDate, checkOutDate, roomId) => {
try {


const bookings = await Booking.find({
  room: roomId,
  checkInDate: { $lte: checkOutDate },
  checkOutDate: { $gte: checkInDate }
});

return bookings.length === 0;


} catch (error) {
throw new Error(error.message);
}
};

// API to check room availability
export const checkRoomAvailabilityAPI = async (req, res) => {
try {


const { checkInDate, checkOutDate, room } = req.body;

const isAvailable = await checkAvailability(checkInDate, checkOutDate, room);

res.json({ success:true, isAvailable });


} catch (error) {
res.json({ success:false, message:error.message });
}
};

// create booking
export const createBooking = async (req, res) => {
try {


const { room, checkInDate, checkOutDate, guests } = req.body;

const user = req.user._id;

const isAvailable = await checkAvailability(checkInDate, checkOutDate, room);

if (!isAvailable) {
  return res.json({
    success:false,
    message:"Room is not available for the selected dates"
  });
}

const roomData = await Room.findById(room);

const timeDiff =
  Math.abs(new Date(checkOutDate).getTime() - new Date(checkInDate).getTime());

const numberOfNights =
  Math.ceil(timeDiff / (1000 * 3600 * 24));

const totalPrice =
  numberOfNights * roomData.pricePerNight;

const booking = await Booking.create({
  user,
  room,
  hotel: roomData.hotel,
  checkInDate,
  checkOutDate,
  totalPrice,
  guests: +guests
});

res.json({
  success:true,
  message:"Booking created successfully",
  booking
});


} catch (error) {
console.log("CREATE BOOKING ERROR:", error);
res.json({ success:false, message:error.message });
}
};

// get user bookings
export const getUserBookings = async (req, res) => {
try {


const bookings = await Booking.find({ user:req.user._id })
  .populate("room hotel")
  .sort({ createdAt:-1 });

res.json({ success:true, bookings });


} catch (error) {
res.json({ success:false, message:error.message });
}
};

// get hotel owner bookings
export const getHotelBookings = async (req, res) => {
try {

const hotelData = await Hotel.findOne({ owner:req.user._id });

if(!hotelData){
  return res.json({
    success:false,
    message:"Hotel not found for the owner"
  });
}

const bookings = await Booking.find({ hotel:hotelData._id })
  .populate("room hotel user")
  .sort({ createdAt:-1 });

const totalBookings = bookings.length;

const totalRevenue =
  bookings.reduce((acc,b)=>acc + b.totalPrice,0);

res.json({
  success:true,
  dashboard:{
    totalBookings,
    totalRevenue,
    bookings
  }
});


} catch (error) {
console.log("OWNER BOOKINGS ERROR:", error);
res.json({ success:false, message:error.message });
}
};
