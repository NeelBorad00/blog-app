# Blog Application
live at :  [https://blog-app-frontend-0ink.onrender.com](https://blog-app-frontend-0ink.onrender.com)

A full-stack blog application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (Register/Login)
- Create, read, update, and delete blogs
- Like and save blogs
- Image upload for blog covers
- Responsive design
- Pagination
- Rich text editor for blog content
- Real-time read progress tracking
- Related blogs suggestions

## Tech Stack

- Frontend: React.js, Material-UI, Redux Toolkit, ReactQuill
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- File Upload: Multer with Cloudinary
- State Management: Redux Toolkit
- UI Components: Material-UI
- Form Validation: Express Validator

## Live Demo

Frontend: [https://blog-app-frontend-0ink.onrender.com](https://blog-app-frontend-0ink.onrender.com)
Backend API: [https://blog-app-backend-0ink.onrender.com](https://blog-app-backend-0ink.onrender.com)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/NeelBorad00/blog-app.git
cd blog-app
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Create .env files in both backend and frontend directories

### Environment Variables

#### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm start
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Deployment

The application is deployed on Render:
- Frontend: Static site deployment
- Backend: Web service deployment
- Database: MongoDB Atlas

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Blog Endpoints
- GET /api/blogs - Get all blogs (with pagination)
- POST /api/blogs - Create a new blog
- GET /api/blogs/:id - Get a single blog
- PUT /api/blogs/:id - Update a blog
- DELETE /api/blogs/:id - Delete a blog
- POST /api/blogs/:id/like - Like/Unlike a blog
- POST /api/blogs/:id/save - Save/Unsave a blog
- GET /api/blogs/saved - Get saved blogs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Neel Borad
- GitHub: [@NeelBorad00](https://github.com/NeelBorad00) 
