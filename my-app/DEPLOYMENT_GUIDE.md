# 🚀 Complete GitHub & Deployment Guide

This guide will walk you through pushing your Tensed Intern App to GitHub and deploying it to production with a scalable database setup.

## Table of Contents
1. [GitHub Setup](#github-setup)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment (Render/Railway)](#backend-deployment)
4. [Database Setup (PostgreSQL)](#database-setup-postgresql)
5. [Environment Variables](#environment-variables)
6. [Scaling for Future Growth](#scaling-for-future-growth)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## GitHub Setup

### Step 1: Install Git

If you don't have Git installed:
- **Windows**: Download from [git-scm.com](https://git-scm.com/download/win)
- **Mac**: `brew install git`
- **Linux**: `sudo apt install git`

Verify installation:
```bash
git --version
```

### Step 2: Configure Git Locally

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create account)
2. Click "+" → "New repository"
3. Fill in details:
   - **Repository name**: `Tensed-Intern-App`
   - **Description**: "Full-stack job application tracking platform for interns"
   - **Public/Private**: Choose based on preference
   - **DO NOT** initialize with README (we have one)
4. Click "Create repository"

### Step 4: Push Local Code to GitHub

```bash
cd d:\TensedIntern\my-app

# Initialize git if not already done
git init

# Configure user (one-time)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Full-stack Tensed Intern App with scalable architecture"

# Rename branch to main
git branch -M main

# Add remote origin (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/Tensed-Intern-App.git

# Push to GitHub
git push -u origin main
```

### Step 5: Verify on GitHub

Go to `https://github.com/YOUR_USERNAME/Tensed-Intern-App` and confirm all files are there.

---

## Frontend Deployment (Vercel)

Vercel is the creators of Next.js and provides excellent Vite support.

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Grant Vercel access to your repositories
4. Click "Import Project"
5. Select `Tensed-Intern-App` repository

### Step 2: Configure Build Settings

Vercel should auto-detect Vite. Confirm:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher

### Step 3: Set Environment Variables

In Vercel dashboard:
```
VITE_API_URL = https://your-backend-domain.com/api
```

(Replace with actual backend URL after deploying backend)

### Step 4: Deploy

Click "Deploy" - Vercel will:
1. Clone your repo
2. Install dependencies
3. Run build command
4. Deploy to CDN globally

Your frontend will be live at: `https://tensed-intern-app.vercel.app`

### Step 5: Update Frontend Code

In `src/services/api.js`, ensure API URL uses environment variable:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});
```

---

## Backend Deployment

Choose one of the following options:

### Option A: Render (Recommended for Beginners)

Render is simple to use and includes free PostgreSQL database option.

#### Step 1: Prepare Backend

Ensure `package.json` has correct scripts:
```json
{
  "scripts": {
    "server": "node server/index.js",
    "dev:server": "nodemon server/index.js"
  }
}
```

#### Step 2: Connect to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your `Tensed-Intern-App` repository
5. Fill in configuration:
   - **Name**: `tensed-intern-api`
   - **Environment**: Node
   - **Region**: Choose closest to you
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`

#### Step 3: Add PostgreSQL Database

In Render dashboard:
1. Click "New +" → "PostgreSQL"
2. Name: `tensed-intern-db`
3. Region: Same as Web Service
4. PostgreSQL Version: 15
5. Create Database

Render will provide connection string automatically.

#### Step 4: Set Environment Variables

In Render Web Service → Environment:
```
NODE_ENV = production
PORT = 5000
JWT_SECRET = your_super_secret_key_here_min_32_chars

DB_TYPE = postgres
DB_HOST = [from Render PostgreSQL]
DB_PORT = 5432
DB_NAME = tensed_intern
DB_USER = [from Render]
DB_PASSWORD = [from Render]

FRONTEND_URL = https://your-frontend-domain.com
```

#### Step 5: Deploy

Click "Deploy" - Render will auto-deploy when you push to GitHub.

Backend will be live at: `https://tensed-intern-api.onrender.com`

---

### Option B: Railway

Railway is also beginner-friendly and integrates GitHub seamlessly.

#### Step 1: Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Select "Deploy from GitHub repo"
5. Choose `Tensed-Intern-App`

#### Step 2: Add PostgreSQL Database

1. Click "Add Service" → "Database" → "PostgreSQL"
2. Railway auto-generates credentials and connection string

#### Step 3: Configure Environment

Railway auto-reads `Procfile`. Create `Procfile`:

```
web: npm run server
```

Then set environment variables (same as Render step above).

#### Step 4: Deploy

Railway auto-deploys when you push to GitHub.

---

## Database Setup (PostgreSQL)

### Option 1: Render PostgreSQL (Easiest)

Use the PostgreSQL database created in Render above.

Connection string provided automatically in Render dashboard.

### Option 2: Neon (Advanced, Free Tier Available)

1. Go to [neon.tech](https://neon.tech)
2. Sign up
3. Create new project
4. Copy connection string

Update `.env`:
```env
DB_TYPE=postgres
DB_HOST=ec2-xxx-xxx-xxx-xxx.compute-1.amazonaws.com
DB_PORT=5432
DB_NAME=neon_project
DB_USER=neon_user
DB_PASSWORD=password_here
```

### Option 3: Supabase (Full Firebase Alternative)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Update `.env` with credentials

### Database Auto-Initialization

Your backend server automatically:
1. Connects to PostgreSQL
2. Creates all 4 tables (users, job_applications, saved_jobs, job_listings)
3. Sets up proper indexes
4. Is ready to receive requests

**Important**: When switching from SQLite to PostgreSQL, the backend code automatically detects the `DB_TYPE` environment variable and uses the appropriate connection.

---

## Environment Variables

### Development (.env)
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=dev_secret_key_here

DB_TYPE=sqlite
DB_PATH=./database/tensed_intern.db

FRONTEND_URL=http://localhost:5174
SESSION_SECRET=dev_session_secret
```

### Production (Set in Vercel + Render/Railway dashboards)
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_production_secret_key_minimum_32_characters_secure

DB_TYPE=postgres
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=tensed_intern
DB_USER=db_username
DB_PASSWORD=very_secure_password_here

FRONTEND_URL=https://your-vercel-domain.com
SESSION_SECRET=production_session_secret
```

### Generating Secure Secrets

```bash
# Generate 32-character random string for JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online tools:
# - https://generatepassword.com/ (32+ characters, mixed case)
# - https://www.random.org/strings/ (10 random strings, 32 chars)
```

---

## Scaling for Future Growth

Your architecture is designed to handle growth:

### Database Scalability

**SQLite** (Development):
- Single file database
- Fast local development
- Suitable for < 100,000 records

**PostgreSQL** (Production):
- Client-server architecture
- Handles millions of records
- Connection pooling support
- Automatic backups available
- Can add read replicas for scaling

### Performance Optimizations

#### 1. Database Connection Pooling

Update `server/db.js` for production:

```javascript
// Install: npm install pg-pool

import Pool from 'pg-pool';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,              // max 20 connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

#### 2. API Response Caching

```javascript
// Install: npm install redis

import redis from 'redis';

const cache = redis.createClient();

// Cache hot jobs for 1 hour
app.get('/api/jobs/hot/list', async (req, res) => {
  const cached = await cache.get('hot_jobs');
  if (cached) return res.json(JSON.parse(cached));
  
  const jobs = await getHotJobs();
  await cache.setEx('hot_jobs', 3600, JSON.stringify(jobs));
  res.json(jobs);
});
```

#### 3. Database Indexing

PostgreSQL automatically adds indexes:
```sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_apps_user ON job_applications(user_id);
CREATE INDEX idx_apps_status ON job_applications(status);
CREATE INDEX idx_saved_user ON saved_jobs(user_id);
```

#### 4. API Rate Limiting

```javascript
// Install: npm install express-rate-limit

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100                    // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### 5. Pagination for Large Datasets

```javascript
// Updated endpoint
app.get('/api/applications', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  const apps = await db.query(
    'SELECT * FROM job_applications WHERE user_id = ? LIMIT ? OFFSET ?',
    [userId, limit, offset]
  );
  
  res.json({
    data: apps,
    page,
    limit,
    total: await getTotal()
  });
});
```

### Frontend Scaling

- **Code Splitting**: Vite automatically splits code by route
- **Image Optimization**: Use next-gen formats (WebP)
- **Lazy Loading**: Components load on demand
- **Caching**: Service Workers cache static assets

---

## Monitoring & Maintenance

### 1. Monitor Backend Health

Add health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: 'connected'
  });
});
```

Check regularly: `https://your-backend.com/health`

### 2. View Logs

**Render**: Dashboard → Web Service → Logs
**Railway**: Dashboard → Deployments → Logs
**Vercel**: Dashboard → Project → Deployments → Logs

### 3. Database Backups

- **Render**: Automatic daily backups
- **Neon**: Automatic backups with retention
- **Supabase**: Daily backups included

### 4. Monitor Performance

Use services like:
- [Sentry.io](https://sentry.io) - Error tracking
- [New Relic](https://newrelic.com) - Performance monitoring
- [LogRocket](https://logrocket.com) - Frontend monitoring
- [Datadog](https://www.datadoghq.com) - Infrastructure monitoring

### 5. Security Updates

```bash
# Check for vulnerable dependencies
npm audit

# Update dependencies
npm update
npm audit fix

# Push updates to GitHub
git add package-lock.json
git commit -m "Security: Update dependencies"
git push origin main
```

---

## Complete Deployment Checklist

- [ ] Git installed and configured
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub main branch
- [ ] Vercel account created and connected
- [ ] Frontend deployed to Vercel
- [ ] Backend hosting (Render/Railway) connected
- [ ] PostgreSQL database created
- [ ] Environment variables set in both Vercel and backend service
- [ ] Backend deployed
- [ ] Frontend `.env` updated with backend URL
- [ ] Frontend redeployed with updated API URL
- [ ] Test registration: `https://your-vercel-domain.com`
- [ ] Test login and dashboard functionality
- [ ] Test job applications creation
- [ ] Database backups configured
- [ ] Health checks verified
- [ ] Monitoring setup complete

---

## Useful Commands

```bash
# View deployment status
git log --oneline -5

# Check environment on backend
curl https://your-backend.com/health

# View database connection
# In Render/Railway dashboard: Database → Connection

# Force redeploy (Vercel/Render/Railway)
# Push empty commit
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## Support & Troubleshooting

### Frontend not connecting to backend?
1. Check VITE_API_URL in Vercel
2. Verify backend is running: `https://your-backend.com/health`
3. Check CORS configuration in `server/index.js`
4. Ensure frontend URL in `FRONTEND_URL` env var matches

### Database connection errors?
1. Verify DB credentials are correct
2. Check IP allowlist in PostgreSQL provider
3. Ensure `DB_TYPE=postgres` is set
4. Review backend logs in Render/Railway

### Deployment failed?
1. Check build logs in Vercel/Render/Railway
2. Verify `package.json` scripts
3. Ensure all environment variables are set
4. Try force redeploy with empty commit

### Performance issues?
1. Enable caching in backend
2. Add rate limiting
3. Optimize database queries
4. Use pagination for large datasets
5. Check Render/Railway resource limits

---

**You're all set! Your Tensed Intern App is now production-ready with scalable architecture.** 🚀

For questions, check the main [README.md](./README.md) or create an issue on GitHub.
