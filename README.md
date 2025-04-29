
# CareMeds - Medicine Delivery App

CareMeds is a multi-vendor medicine delivery application with separate interfaces for customers, pharmacy sellers, and admins.

## Project Structure

This project consists of two main parts:

1. **Server** - Node.js/Express backend with MongoDB
2. **Mobile** - React Native with Expo

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- MongoDB (running locally or connection string to MongoDB Atlas)
- Expo CLI (`npm install -g expo-cli`)

### Setting Up the Backend Server

1. Navigate to the server directory:
```
cd server
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the server directory with these variables:
```
MONGODB_URI=mongodb://localhost:27017/caremeds
JWT_SECRET=your_jwt_secret_key_here
```

4. Start the server:
```
npm run dev
```

The server will be running on http://localhost:5000

### Setting Up the Mobile App

1. Navigate to the mobile directory:
```
cd mobile
```

2. Install dependencies:
```
npm install
```

3. Start the Expo development server:
```
npm start
```

4. Use the Expo Go app on your phone to scan the QR code, or press 'a' to open in an Android emulator or 'i' to open in an iOS simulator.

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login user/seller/admin
- POST `/api/auth/register` - Register new user/seller

### Products
- GET `/api/product` - Get all products
- POST `/api/product` - Create a new product (seller only)
- GET `/api/product/:id` - Get product by ID
- PUT `/api/product/:id` - Update a product (seller only)
- DELETE `/api/product/:id` - Delete a product (seller only)

### Orders
- POST `/api/order` - Create a new order
- GET `/api/order/myorders` - Get logged in user orders
- GET `/api/order/seller` - Get seller orders
- PUT `/api/order/:id/status` - Update order status
- GET `/api/order/:id` - Get order by ID

### Seller
- GET `/api/seller/products` - Get seller products
- GET `/api/seller/stats` - Get seller statistics

### Admin
- GET `/api/admin/sellers` - Get all sellers
- GET `/api/admin/stats` - Get admin statistics

## Demo Accounts

- User: user@example.com / password
- Seller: seller@example.com / password
- Admin: admin@example.com / admin
