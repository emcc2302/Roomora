import stripe from "stripe";
import Booking from "../models/Booking.js";

export const stripeWebhook = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ WEBHOOK VERIFY ERROR:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const bookingId = session.metadata.bookingId;

    console.log("✅ PAYMENT SUCCESS:", bookingId);

    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "Stripe",
      paidAt: new Date(), 
    });
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};