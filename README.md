# Roomora – Hotel Booking Portal 🏨

Roomora is a full-stack hotel booking web application built with the MERN stack.
It allows users to explore hotels, check room availability, book rooms, and securely complete payments with Stripe integration.

---

## 🔗 Live Demo

Frontend (Vercel): https://roomora-main.vercel.app
Backend (Vercel): https://roomora-backend-psi.vercel.app

---

<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/06fa2d18-8833-489e-882d-67f4f3738a3e" />
<img width="1906" height="909" alt="image" src="https://github.com/user-attachments/assets/8ce36f53-9619-49b2-9e39-8b6de8b354bf" />



## ✨ Features

• Secure authentication using Clerk
• Browse hotels and filter available rooms
• Real-time room availability and booking system
• Stripe payment gateway integration
• Email notifications using Nodemailer + Brevo (SMTP)
• Image uploads via Cloudinary
• Booking dashboard for users
• Admin controls for hotels and rooms
• Fully responsive UI

---

## 🛠️ Tech Stack

Frontend: React.js, Vite, CSS, Axios
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Authentication: Clerk
Payments: Stripe
Media Storage: Cloudinary
Email Service: Nodemailer (Brevo SMTP)
Deployment: Vercel

---

## ⚙️ Installation

Clone repository

git clone https://github.com/yourusername/roomora.git
cd roomora

---

### Install dependencies

Backend

cd backend
npm install

Frontend

cd frontend
npm install

---

## 🔐 Environment Variables

Create `.env` file inside **backend**

PORT=5000
MONGODB_URI=your_mongodb_connection_string

# Clerk

CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Cloudinary

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer + Brevo SMTP)

SENDER_EMAIL=[your_email@domain.com](mailto:your_email@domain.com)
SMTP_USER=your_brevo_smtp_user
SMTP_PASS=your_brevo_smtp_key

CLIENT_URL=https://roomora-main.vercel.app

# Stripe

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

Create `.env` file inside **frontend**

VITE_BACKEND_URL=https://roomora-backend-psi.vercel.app
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
VITE_CURRENCY=INR

# Stripe

VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

---

## ▶️ Run Locally

Backend

npm run dev

Frontend

npm run dev

---

## 💳 Stripe Payment Integration

• Secure checkout using Stripe API
• Backend verification using webhook
• Booking confirmation after successful payment

---

## 📦 API Endpoints (Sample)

POST /api/auth → authentication
GET /api/hotels → fetch hotels
GET /api/rooms → fetch rooms
POST /api/bookings → create booking
POST /api/payment/create-checkout-session → Stripe checkout

---

## 📌 Future Improvements

• Razorpay integration
• Hotel reviews and ratings
• Admin analytics dashboard

---

## 👨‍💻 Author

Soriful Islam Sk
CSE Student | MERN Developer
