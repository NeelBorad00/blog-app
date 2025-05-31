# Blog Application

A full-stack blog application built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete blog posts
- Responsive design using Material-UI
- Protected routes for authenticated users
- State management with Redux Toolkit

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-application
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-app
JWT_SECRET=your_jwt_secret
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at http://localhost:3000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Blogs
- GET /api/blogs - Get all blogs
- GET /api/blogs/:id - Get a specific blog
- POST /api/blogs - Create a new blog
- PUT /api/blogs/:id - Update a blog
- DELETE /api/blogs/:id - Delete a blog

## Technologies Used

- Frontend:
  - React
  - Redux Toolkit
  - Material-UI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT Authentication
  - Express Validator

## Project Structure

```
blog-app/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend application
└── README.md         # Project documentation
``` 