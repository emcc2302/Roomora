// import Room from "../models/Room.js";
// import Hotel from "../models/Hotel.js";
// import { v2 as cloudinary } from "cloudinary";

// // create room
// export const createRoom = async (req, res) => {
//   try {

//     const userId = req.user._id;

//     const { roomType, pricePerNight, amenities } = req.body;

//     const hotel = await Hotel.findOne({ owner: userId });

//     if (!hotel) {
//       return res.json({ success:false, message:"Hotel not found" });
//     }

//     const uploadedImages = req.files.map(async (file)=>{
//       const response = await cloudinary.uploader.upload(file.path);
//       return response.secure_url;
//     });

//     const images = await Promise.all(uploadedImages);

//     const room = await Room.create({
//       hotel: hotel._id,
//       roomType,
//       pricePerNight: +pricePerNight,
//       amenities: JSON.parse(amenities),
//       images
//     });

//     res.json({
//       success:true,
//       message:"Room created successfully",
//       room
//     });

//   } catch(error){
//     console.log("CREATE ROOM ERROR:", error);
//     res.json({ success:false, message:error.message });
//   }
// };


// // get all rooms
// export const getRooms = async (req, res) => {
//   try {

//     const rooms = await Room.find({ isAvailable:true })
//       .populate({
//         path:"hotel",
//         populate:{
//           path:"owner",
//           select:"image"
//         }
//       })
//       .sort({ createdAt:-1 });

//     res.json({ success:true, rooms });

//   } catch(error){
//     console.log("GET ROOMS ERROR:", error);
//     res.json({ success:false, message:error.message });
//   }
// };


// // owner rooms
// export const getOwnerRooms = async (req, res) => {
//   try {

//     const userId = req.user._id;

//     const hotelData = await Hotel.findOne({ owner:userId });

//     if(!hotelData){
//       return res.json({ success:false, message:"Hotel not found" });
//     }

//     const rooms = await Room.find({
//       hotel:hotelData._id
//     }).populate("hotel");

//     res.json({ success:true, rooms });

//   } catch(error){
//     console.log("OWNER ROOMS ERROR:", error);
//     res.json({ success:false, message:error.message });
//   }
// };


// // toggle availability
// export const toggleRoomAvailability = async (req, res) => {
//   try {

//     const { roomId } = req.body;

//     const roomData = await Room.findById(roomId);

//     if(!roomData){
//       return res.json({ success:false, message:"Room not found" });
//     }

//     roomData.isAvailable = !roomData.isAvailable;

//     await roomData.save();

//     res.json({
//       success:true,
//       message:"Room availability toggled successfully",
//       room:roomData
//     });

//   } catch(error){
//     console.log("TOGGLE ROOM ERROR:", error);
//     res.json({ success:false, message:error.message });
//   }
// };


import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// ---------------- CREATE ROOM ----------------
export const createRoom = async (req, res) => {
  try {
    const userId = req.user._id;

    const { roomType, pricePerNight, amenities, images } = req.body;

    const hotel = await Hotel.findOne({ owner: userId });

    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    const room = await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: amenities || [],
      images: images || [],
    });

    res.json({
      success: true,
      message: "Room created successfully",
      room,
    });

  } catch (error) {
    console.log("CREATE ROOM ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};


// ---------------- GET ALL ROOMS ----------------
export const getRooms = async (req, res) => {
  try {

    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms });

  } catch (error) {
    console.log("GET ROOMS ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};


// ---------------- OWNER ROOMS ----------------
export const getOwnerRooms = async (req, res) => {
  try {

    const userId = req.user._id;

    const hotelData = await Hotel.findOne({ owner: userId });

    if (!hotelData) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    const rooms = await Room.find({
      hotel: hotelData._id,
    }).populate("hotel");

    res.json({ success: true, rooms });

  } catch (error) {
    console.log("OWNER ROOMS ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};


// ---------------- TOGGLE ROOM AVAILABILITY ----------------
export const toggleRoomAvailability = async (req, res) => {
  try {

    const { roomId } = req.body;

    const roomData = await Room.findById(roomId);

    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    roomData.isAvailable = !roomData.isAvailable;

    await roomData.save();

    res.json({
      success: true,
      message: "Room availability toggled successfully",
      room: roomData,
    });

  } catch (error) {
    console.log("TOGGLE ROOM ERROR:", error);
    res.json({ success: false, message: error.message });
  }
};