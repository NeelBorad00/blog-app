# Blog Application

A full-stack blog application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (Register/Login)
- Create, read, update, and delete blogs
- Like and save blogs
- Image upload for blog covers
- Responsive design
- Pagination
- Rich text editor for blog content

## Tech Stack

- Frontend: React.js, Material-UI, Redux Toolkit
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- File Upload: Multer

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
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

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## License

MIT 