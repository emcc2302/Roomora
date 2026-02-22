import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, city, address, contact } = req.body;
    const owner = req.user._id; // The user object is attached to the request by the protect middleware

    const hotel = await Hotel.findOne({ owner });

    // Check if user already registered a hotel
    if (hotel) {
      return res.json({
        success: false,
        message: "Hotel Already Registered",
      });
    }

    // Create new hotel
    await Hotel.create({
      name,
      city,
      address,
      contact,
      owner,
    });

    // Update user role to hotelOwner
    await User.findByIdAndUpdate(owner, {
      role: "hotelOwner",
    });

    res.json({
      success: true,
      message: "Hotel Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
