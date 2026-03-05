import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {

    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success:false,
        message:"Unauthorized"
      });
    }

    const user = await User.findById(userId);

    // If user exists attach it
    if(user){
      req.user = user;
    }
    // If not, still attach the id so controller can create user
    else{
      req.user = { _id: userId };
    }

    next();

  } catch (error) {

    console.log("AUTH MIDDLEWARE ERROR:", error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};