import User
 from "../models/User";

 // Middleware to check if the user is authenticated
export const protect = async (req, res, next) => {
    // try {
        const {userId} = req.auth; // Assuming Clerk adds the user ID to the request object    
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Optionally, you can fetch the user from the database and attach it to the request object
        else{
        const user = await User.findById(userId);
        req.user = user; // Attach the user object to the request
        next(); // Proceed to the next middleware or route handler
        }
// ById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         req.user = user; // Attach the user object to the request
//         next(); // Proceed to the next middleware or route handler
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
};