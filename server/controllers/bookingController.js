import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import transporter from "../configs/nodemailer.js";

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

const user = req.user?._id;

if (!user) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

const isAvailable = await checkAvailability(checkInDate, checkOutDate, room);

if (!isAvailable) {
  return res.json({
    success:false,
    message:"Room is not available for the selected dates"
  });
}

const roomData = await Room.findById(room).populate("hotel");

const timeDiff =
  Math.abs(new Date(checkOutDate).getTime() - new Date(checkInDate).getTime());

const numberOfNights =
  Math.ceil(timeDiff / (1000 * 3600 * 24));

const totalPrice =
  numberOfNights * roomData.pricePerNight;

const booking = await Booking.create({
  user,
  room,
  hotel: roomData.hotel._id,
  checkInDate,
  checkOutDate,
  totalPrice,
  guests: +guests
});

// Send booking confirmation email to the user
const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: req.user.email,
  subject: "Booking Confirmation",
  html: `
    <p>Dear ${req.user.username},</p>
    <p>Your booking has been created successfully.</p>
    <p><strong>Booking Details:</strong></p>
    <ul>
    <li><strong>Booking ID:</strong> ${booking._id}</li>
    <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
    <li><strong>Location:</strong> ${roomData.hotel.address}</li>
      <li><strong>Check-In:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</li>
      <li><strong>Check-Out:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</li>
      <li><strong>Guests:</strong> ${booking.guests}</li>
      <li><strong>Total Price:</strong> ${process.env.CURRENCY || '$'}${booking.totalPrice.toFixed(2)}</li>
    </ul>
    <p>Thank you for choosing our service!</p>
  `
};

// await transporter.sendMail(mailOptions);

try {
  const info = await transporter.sendMail(mailOptions);
  console.log("MAIL SENT:", info.response);
} catch (err) {
  console.log("MAIL ERROR:", err);
}

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
