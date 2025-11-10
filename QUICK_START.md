# 🚀 Shoppa - Quick Start Guide

## ✅ Installation Complete!

All dependencies have been installed successfully. Follow these steps to run your application.

## Prerequisites Checklist

- [ ] MongoDB installed and running
- [ ] Node.js installed (v18+)
- [ ] Email credentials configured (for contact form)

## 🏃‍♂️ Running the Application

### 1. Start MongoDB

**Windows:**
```bash
# Open a new terminal and run:
mongod
```

**macOS/Linux:**
```bash
# Usually MongoDB runs as a service
brew services start mongodb-community
# OR
sudo systemctl start mongod
```

### 2. Configure Email (Optional but Recommended)

Edit `server/.env` and update these lines with your Gmail credentials:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

**To get Gmail App Password:**
1. Go to Google Account Settings
2. Security → 2-Step Verification
3. App passwords → Generate new password
4. Copy and paste into `.env`

### 3. Start the Backend Server

Open a terminal and run:
```bash
cd server
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### 4. Start the Frontend

Open a **new terminal** and run:
```bash
cd client
npm run dev
```

You should see:
```
  VITE ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### 5. Open Your Browser

Navigate to: **http://localhost:5173**

## 🎯 First Steps

### Create a Test User
1. Click "Login" → "Sign up"
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Create Account"

### Create an Admin User (Optional)
1. Register a normal user first
2. Connect to MongoDB:
   ```bash
   mongosh
   use shoppa
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 📱 Available Pages

- **Home** (`/`) - Landing page with featured products
- **Shop** (`/shop`) - Product catalog with search
- **About** (`/about`) - About the company
- **Contact** (`/contact`) - Contact form
- **FAQs** (`/faqs`) - Frequently asked questions
- **Cart** (`/cart`) - Shopping cart
- **Login/Register** (`/login`, `/register`) - Authentication
- **User Dashboard** (`/dashboard`) - For logged-in users
- **Admin Dashboard** (`/admin/dashboard`) - For admin users

## 🛠️ Common Issues

### MongoDB Connection Error
**Error:** `MongooseServerSelectionError`

**Solution:**
```bash
# Make sure MongoDB is running
mongod --dbpath /path/to/your/data
```

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Change port in server/.env
PORT=5001
```

### Email Not Sending
**Issue:** Contact form doesn't send emails

**Solution:**
- Check EMAIL_USER and EMAIL_PASSWORD in `server/.env`
- For Gmail, use App-Specific Password
- Temporarily disable email in development by wrapping try-catch in `server/utils/email.js`

## 📊 Testing the Application

### Test Shopping Flow:
1. Browse products on Shop page
2. Click "Add to Cart" on any product
3. View cart (icon in navbar)
4. Adjust quantities
5. Proceed to checkout (requires login)

### Test Admin Features:
1. Create an admin user (see above)
2. Login with admin account
3. Visit `/admin/dashboard`
4. View analytics and manage products

## 🔐 Default Credentials

No default users are created. You must register:

**Regular User:**
- Create via Register page

**Admin User:**
- Register normally, then update role in MongoDB

## 📝 API Endpoints

Backend runs on: `http://localhost:5000`

**Test the API:**
```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products
```

## 🎨 Customization

### Change Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#DC2626', // Your color here
  }
}
```

### Add More Products
Use the admin dashboard or directly in MongoDB:
```javascript
db.products.insertOne({
  name: "New Product",
  description: "Product description",
  price: 99.99,
  category: "Electronics",
  image: "https://example.com/image.jpg",
  stock: 100
})
```

## 🆘 Need Help?

Check the main `README.md` for detailed documentation.

## ✨ You're All Set!

Your Shoppa e-commerce application is now running. Happy coding! 🎉
