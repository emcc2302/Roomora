import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User.js";

// GET /api/user
export const getUserData = async (req, res) => {
try {

let user = await User.findById(req.user._id);

// If user does not exist, create automatically
// if (!user) {
//   user = await User.create({
//     _id: req.user._id,
//     username: req.user.username || "User",
//     email: req.user.email || "",
//     image: req.user.image || "",
//     role: "user",
//     recentSearchedCities: []
//   });

//   console.log("User created:", user._id);
// }

// if (!user) {

// user = await User.create({
// _id: req.user._id,
// username: "User",
// email: "temp@email.com",
// image: "https://placehold.co/100x100",
// role: "user",
// recentSearchedCities: []
// });

// console.log("User created:", user._id);
// }


if (!user) {

  const clerkUser = await clerkClient.users.getUser(req.user._id);

  user = await User.create({
    _id: clerkUser.id,
    username: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`,
    email: clerkUser.emailAddresses[0].emailAddress,
    image: clerkUser.imageUrl,
    role: "user",
    recentSearchedCities: []
  });

  console.log("User created from Clerk:", user._id);
}

res.json({
  success: true,
  role: user.role,
  recentSearchedCities: user.recentSearchedCities
});


} catch (error) {


console.log("GET USER ERROR:", error);

res.status(500).json({
  success: false,
  message: error.message
});


}
};

// POST /api/user/store-recent-search
export const storeRecentSearchCities = async (req, res) => {
try {


const { recentSearchedCity } = req.body;

const user = await User.findById(req.user._id);

if (!user) {
  return res.json({
    success: false,
    message: "User not found"
  });
}

if (user.recentSearchedCities.length < 3) {
  user.recentSearchedCities.push(recentSearchedCity);
} else {
  user.recentSearchedCities.shift();
  user.recentSearchedCities.push(recentSearchedCity);
}

await user.save();

res.json({
  success: true,
  message: "City stored successfully",
  recentSearchedCities: user.recentSearchedCities
});


} catch (error) {


console.log("STORE CITY ERROR:", error);

res.status(500).json({
  success: false,
  message: error.message
});


}
};
