import stripe from 'stripe';
import Booking from '../models/Booking.js';

//API to handle stripe webhooks
export const stripeWebhook = async (req, res) => {
    const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
         res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if(event.type === 'payment_intent.succeeded') {
        // Process the successful payment
        const paymentIntent = event.data.object;
        const paymentId = paymentIntent.id;


        //getting session id from metadata
        const session = stripeInstance.checkout.sessions.list ({
            payment_intent: paymentId,
        });

        const {bookingId} = session.data[0].metadata;

       //mark the booking as paid in the database
       await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Stripe"
       });
    }
    else{
        console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).json({ received: true });
}