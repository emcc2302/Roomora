import User from '../models/User.js';
import { Webhook } from 'svix';

const clerkWebhookSecret =async (req, res) => {
    try{
        //create a new instance of the Webhook class with the secret key
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        //Getting Headers
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature']
        };
        await whook.verify(JSON.stringify(req.body), headers);

        //Getting Data from the request body
        const { data, type } = req.body;
  

        //Switch case to handle different types of events
        switch (type) {
            case 'user.created':{

                      const userData = {
                        _id: data.id,
                        email: data.email_addresses[0].email_address,
                        username: data.first_name + " " + data.last_name,
                        image: data.image_url,
                        role: "user",
                        recentSearchedCities: [],
                      };

                await User.create(userData);
                break;
            }
            case 'user.updated':{

                      const userData = {
                        _id: data.id,
                        email: data.email_addresses[0].email_address,
                        username: data.first_name + " " + data.last_name,
                        image: data.image_url,
                        role: "user",
                        recentSearchedCities: [],
                      };

                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case 'user.deleted':
                await User.findByIdAndDelete(data.id,);
                break;

            default:
                break;
        }
        res.status(200).json({ message: "Webhook received successfully" });
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export default clerkWebhookSecret;