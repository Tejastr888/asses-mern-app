# Job Portal Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that connects job seekers with employers. The platform allows job seekers to find and apply for jobs while enabling employers to post jobs and manage applications.

## Features

### For Job Seekers
- Create and manage professional profiles
- Browse job listings
- Apply for jobs with cover letters
- Track application status
- View interview schedules
- Withdraw applications

### For Employers
- Create company profiles
- Post and manage job listings
- Review job applications
- Schedule interviews with candidates
- Manage applicant statuses

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- Tailwind CSS for styling
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd asses-mern-app
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

## Configuration

1. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

1. Install all dependencies for both frontend and backend:
```bash
npm run install-deps
```

2. Start both frontend and backend concurrently:
```bash
npm start
```

Alternatively, you can use:
```bash
npm run dev
```
This command will install dependencies and start both servers.

Available Scripts:
- `npm run install-deps`: Installs dependencies for both frontend and backend
- `npm run backend`: Runs only the backend server
- `npm run frontend`: Runs only the frontend development server
- `npm start`: Runs both frontend and backend concurrently
- `npm run dev`: Installs dependencies and starts both servers

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

Note: You only need to run `npm run install-deps` once when setting up the project or when new dependencies are added. After that, you can just use `npm start` to run both servers.

## API Routes

### Authentication
- POST /api/users/register - Register new user
- POST /api/users/login - User login

### Job Seeker Routes
- GET /api/applications/me - Get all applications
- POST /api/applications - Create new application
- PUT /api/applications/:id/withdraw - Withdraw application

### Employer Routes
- GET /api/applications/received - Get all received applications
- GET /api/applications/job/:jobId - Get applications for specific job
- PUT /api/applications/:id - Update application status
- POST /api/applications/:id/interview - Schedule interview

## Project Structure
```
asses-mern-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- MongoDB for database
- Express.js for backend framework
- React.js for frontend framework
- Node.js for runtime environment
- Tailwind CSS for styling
