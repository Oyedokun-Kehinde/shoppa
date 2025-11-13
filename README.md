# 🛍️ Shoppa - Premium Nigerian E-Commerce Platform

A modern, full-stack e-commerce platform built with React, TypeScript, Node.js, and MySQL. Features include Paystack payment integration, real-time blog reactions, wishlist management, order tracking, and comprehensive admin controls.

## 🎨 Design

- **Color Scheme**: Red (#DC2626), Black (#000000), White (#FFFFFF)
- **Font**: Google Manrope
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## ✨ Features

### Frontend
- **Pages**:
  - Home - Hero section with featured products
  - Shop - Product listing with search and filters
  - About - Company information and team
  - Contact - Contact form with Nodemailer integration
  - FAQs - Frequently asked questions
  - Cart - Shopping cart management
  
- **Authentication**:
  - User registration
  - User login
  - Protected routes
  - JWT token management
  
- **Dashboards**:
  - User Dashboard - Order history and account management
  - Admin Dashboard - Analytics, orders, and product management

### Backend
- **Authentication**: JWT-based authentication
- **Database**: MongoDB with Mongoose
- **Email**: Nodemailer integration for:
  - Welcome emails
  - Contact form notifications
  - Order confirmations
- **API Endpoints**:
  - Auth (register, login, get user)
  - Products (CRUD operations)
  - Contact form

## 📁 Project Structure

```
shoppa/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── lib/            # API utilities
│   │   └── App.tsx         # Main app with routing
│   └── package.json
│
└── server/                 # Node.js backend
    ├── config/             # Database configuration
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    ├── middleware/         # Auth middleware
    ├── utils/              # Email utilities
    └── server.js           # Express server
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd shoppa
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

4. **Configure Environment Variables**

Create `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shoppa
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=Shoppa <noreply@shoppa.com>

CLIENT_URL=http://localhost:5173
```

Create `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

6. **Start the Backend Server**
```bash
cd server
npm run dev
```

7. **Start the Frontend Development Server**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📧 Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an app-specific password
3. Use that password in `EMAIL_PASSWORD`

## 🔑 Default Admin Account

To create an admin user, you can manually update a user's role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@shoppa.com" },
  { $set: { role: "admin" } }
)
```

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Zustand (State Management)
- Axios
- React Hook Form
- React Hot Toast
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt.js
- Nodemailer
- Express Validator

## 📜 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

## 🌟 Key Features Implemented

1. **Authentication System**
   - Secure registration and login
   - JWT token-based authentication
   - Protected routes for authenticated users
   - Role-based access control (user/admin)

2. **Product Management**
   - Product listing with search and filters
   - Category filtering
   - Product details
   - Admin product CRUD operations

3. **Shopping Cart**
   - Add/remove products
   - Update quantities
   - Persistent cart (local storage)
   - Real-time total calculation

4. **Email Notifications**
   - Welcome emails on registration
   - Contact form submissions
   - Order confirmations

5. **Responsive Design**
   - Mobile-first approach
   - Modern and clean UI
   - Smooth animations and transitions

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Contact
- `POST /api/contact` - Send contact form email

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify as needed.

## 📄 License

MIT

## 👥 Author

Built with ❤️ for e-commerce excellence
