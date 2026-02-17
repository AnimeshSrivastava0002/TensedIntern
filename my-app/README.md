# Tensed Intern App

A modern, full-stack job application tracking platform designed to help interns and entry-level professionals manage their job applications efficiently. Track applications, monitor status updates, and discover new opportunities—all in one beautiful, responsive interface.

![React](https://img.shields.io/badge/React-19.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![SQLite/PostgreSQL](https://img.shields.io/badge/Database-SQLite%20%7C%20PostgreSQL-yellowgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT and bcryptjs password hashing
- **Application Tracking**: Add, update, delete, and organize job applications with status tracking
- **Job Discovery**: Browse jobs from trusted sources with search, filter, and save functionality
- **Analytics**: Track application statistics and visualize your job search progress
- **Responsive Design**: Beautiful dark theme with animations and glassmorphism effects
- **Scalable Backend**: SQLite for development, PostgreSQL for production
- **RESTful API**: Complete API with proper error handling and validation

## 📋 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn

### Installation & Development

```bash
# 1. Clone and install
git clone https://github.com/yourusername/Tensed-Intern-App.git
cd Tensed-Intern-App
npm install

# 2. Setup environment
cp .env.example .env

# 3. Start both servers (in separate terminals)
npm run server    # Terminal 1: Backend on http://localhost:5000
npm run dev       # Terminal 2: Frontend on http://localhost:5174
```

Visit http://localhost:5174 in your browser to get started!

## 📚 Documentation

- [Full README with API docs](./FULL_README.md)
- [API Documentation](#api-endpoints)
- [Deployment Guide](#deployment)
- [Database Schema](#database)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19.2, Vite, React Router, Axios, Framer Motion |
| **Backend** | Node.js, Express.js, JWT, bcryptjs |
| **Database** | SQLite (dev), PostgreSQL (prod) |
| **Deployment** | Vercel (frontend), Render/Railway (backend) |

## 📁 Project Structure

```
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── services/          # API client
│   ├── context/           # Global state
│   └── assets/            # Images, fonts
├── server/                # Express backend
│   ├── routes/           # API endpoints
│   ├── db.js             # Database setup
│   ├── middleware.js      # Auth middleware
│   └── utils.js           # Utilities
├── package.json          # Dependencies
├── vite.config.js        # Frontend config
└── README.md            # This file
```

## 🔑 Key Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Job Applications
- `GET /api/applications` - List user's applications
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/stats/summary` - Get statistics

### Job Listings
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/hot/list` - Get hot jobs
- `POST /api/jobs/save` - Save job
- `DELETE /api/jobs/saved/:id` - Remove saved job

## 🗄️ Database Schema

### Users
```sql
- id (text, primary key)
- name (text)
- email (text, unique)
- password (text, hashed)
- phone (text)
- bio (text)
- profile_image (text)
- timestamps
```

### Job Applications
```sql
- id (text, primary key)
- user_id (text, foreign key)
- company_name (text)
- position_title (text)
- status (text: Applied, Under Review, Shortlisted, Interview Scheduled)
- notes (text)
- rating (integer)
- timestamps
```

### Saved Jobs
```sql
- id (text, primary key)
- user_id (text, foreign key)
- job_title, company, location, salary (text)
- job_url, source (text)
```

### Job Listings
```sql
- id (text, primary key)
- job_title, company, location (text)
- salary, job_url (text)
- source, is_hot (text, boolean)
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Go to vercel.com → Import project
3. Set environment variable: `VITE_API_URL=https://your-api.com`
4. Deploy

### Backend (Render/Railway)
1. Push to GitHub
2. Create new Web Service on Render or Railway
3. Connect GitHub repository
4. Set environment variables (DB credentials, JWT_SECRET)
5. Deploy

### Database (PostgreSQL)
1. Create database on Neon or Supabase
2. Copy connection credentials
3. Update backend environment variables
4. Backend auto-initializes schema on startup

### Complete Deployment Steps
See [FULL_README.md](./FULL_README.md#-deployment) for detailed deployment instructions.

## 🔐 Security

- Passwords hashed with bcryptjs (salt: 10)
- JWT token authentication (7-day expiry)
- CORS configured for frontend domain
- Input validation on backend
- Password validation rules enforced
- Never commit .env with secrets

## 📖 API Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Create Application
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Tech Corp",
    "position_title": "React Developer",
    "notes": "Applied via LinkedIn"
  }'
```

## 📊 Available Scripts

```bash
# Frontend
npm run dev          # Start Vite dev server (port 5174)
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
npm run server       # Start Express server (port 5000)
npm run dev:server   # Start with auto-reload (nodemon)
```

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push branch: `git push origin feature/YourFeature`
5. Open a Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Troubleshooting

**Port already in use?**
```bash
# Find and kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run server
```

**Database errors?**
- Ensure `server/database/` directory exists
- Check file permissions
- Delete tensed_intern.db to reset database

**API connection errors?**
- Verify backend is running: http://localhost:5000
- Check CORS configuration matches frontend URL
- Verify JWT_SECRET in .env

**Build errors?**
```bash
npm install          # Reinstall dependencies
npm run build        # Try building again
```

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Interview scheduling
- [ ] Resume builder
- [ ] Company reviews
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Job recommendations AI

## 📞 Support

For issues and questions:
1. Check [Issues](https://github.com/yourusername/Tensed-Intern-App/issues)
2. Create a new issue with clear description
3. Include error messages and environment details

---

**Made with ❤️ for interns everywhere**
