# Task Management & Collaboration Board

A MERN task board for role-based collaboration between admin and regular users. Admins manage boards, members, and all tasks; users work only inside boards they belong to.

## Live URLs

- Frontend: _replace with deployed URL_
- Backend: _replace with deployed URL_

## Local Setup

1. Install dependencies in both folders:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Copy `.env.example` to your environment configuration and set real values.
3. Start the backend:
   - `cd backend && npm run dev`
4. Start the frontend:
   - `cd frontend && npm run dev`

## Environment Variables

- `MONGO_URI` - MongoDB connection string.
- `JWT_SECRET` - Secret used to sign authentication tokens.
- `PORT` - Backend port.
- `CLIENT_URL` - Frontend origin allowed by CORS.
- `VITE_API_URL` - Frontend API base URL.

## API Overview

| Method | Route | Description | Access |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Login and get JWT | Public |
| GET | `/api/auth/me` | Current user profile | Auth |
| GET | `/api/users` | List users | Admin |
| POST | `/api/boards` | Create a board | Admin |
| GET | `/api/boards` | List boards | Auth |
| GET | `/api/boards/:id/tasks` | List board tasks | Auth + member |
| PUT | `/api/tasks/:id` | Update task | Auth |
| DELETE | `/api/tasks/:id` | Delete task | Admin |

## Screenshots

![
    Login
](<Screenshot 2026-06-13 205120-1.png>)
![
    Register
](<Screenshot 2026-06-13 205139-1.png>)
![
    Dashboard
](<Screenshot 2026-06-13 205329.png>)
![
    All Users
](<Screenshot 2026-06-13 205345.png>)
![
    All Boards
](<Screenshot 2026-06-13 205358-1.png>)
![
    Boards and Task
](<Screenshot 2026-06-13 205425-1.png>)