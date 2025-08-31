# Orbit

Orbit is a full-stack social media web application where users can sign up, create posts, follow others, and receive notifications.

## ✨ Features

- 🔐 User authentication (signup/login)
- 📝 Create, edit, and delete posts
- 👥 Follow/unfollow users
- 🎨 Responsive UI with theme toggle
- 📷 Image uploads with Cloudinary
- 💬 Interactive social features

## 🛠️ Tech Stack

### Frontend
- **React** - User interface library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS
- **React Router Dom** - Client-side routing
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and management
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
Orbit._/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── db/               # Database connection
│   ├── middleware/       # Authentication middleware
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utility functions
│   └── package.json
├── package.json         # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajanikant04/Orbit._
   cd Orbit._
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the backend server (http://localhost:5000) and the frontend development server (http://localhost:5173).

## 📜 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - Build the application for production

## 🌐 Live Demo

Visit the live application: [https://orbit-8rsw.onrender.com/](https://orbit-8rsw.onrender.com/)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile/:username` - Get user profile
- `GET /api/users/suggested` - Get suggested users
- `POST /api/users/follow/:id` - Follow/unfollow user
- `POST /api/users/update` - Update user profile

### Posts
- `GET /api/posts/all` - Get all posts
- `GET /api/posts/following` - Get posts from followed users
- `GET /api/posts/likes/:id` - Get users who liked a post
- `GET /api/posts/user/:username` - Get posts by user
- `POST /api/posts/create` - Create new post
- `POST /api/posts/like/:id` - Like/unlike post
- `POST /api/posts/comment/:id` - Comment on post
- `DELETE /api/posts/:id` - Delete post

### Notifications
- `GET /api/notifications` - Get user notifications
- `DELETE /api/notifications` - Delete all notifications

## 🎯 Key Learnings

- Express parsers should be configured before route definitions
- Always use optional chaining (`?`) when accessing potentially undefined variables
- Proper error handling and validation are crucial for robust applications

## 👨‍💻 Author

**Rajanikant** - [GitHub Profile](https://github.com/rajanikant04)
