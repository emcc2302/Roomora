//Get/api/user/



export const getUserData = async (req, res) => {
    try {
        const role = req.user.role; // The user object is attached to the request by the protect middleware
        const recentSerachCityes = req.user.recentSerachCities; // The user object is attached to the request by the protect middleware
        res.json({success: true, role, recentSerachCityes });
    }
    catch (error) {

        res.status(500).json({success: false, message: error.message });
    }
}

//Store User Recent Search Cities
export const storeRecentSearchCities = async (req, res) => {
    try {
        const { recentSerachedCity } = req.body; // this is called object destructuring, it allows us to extract the city property from the request body.same things as const city = req.body.city;
        const user = await req.user; // The user object is attached to the request by the protect middleware
        if(user.recentSerachCities.length <3) {
            user.recentSerachCities.push(recentSerachedCity); // Add the new city to the array
        } else {
            user.recentSerachCities.shift(); // Remove the oldest city if there are already 5 cities in the array
            user.recentSerachCities.push(recentSerachedCity); // Add the new city to the array
        }
        await user.save(); // Save the updated user object back to the database
        res.json({success: true, message: "City added to recent search cities" });
    }    catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
}