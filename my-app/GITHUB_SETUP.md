# 📦 GitHub & Production Deployment - Quick Start Guide

## What We've Prepared

Your Tensed Intern App is now production-ready with:

✅ Complete backend with Express.js  
✅ SQLite database for development  
✅ PostgreSQL support for production scaling  
✅ JWT authentication system  
✅ Full-featured React frontend  
✅ Comprehensive README and documentation  
✅ Environment variable templates (.env.example)  
✅ Database schema files for both SQLite and PostgreSQL  
✅ Gitignore configured to exclude sensitive files  
✅ MIT License included  

---

## 🚀 Next Steps (Copy & Paste Commands)

### Step 1: Install Git

**Windows:**
```bash
# Download and install from: https://git-scm.com/download/win
# Then restart your terminal
git --version  # Verify installation
```

**Mac:**
```bash
brew install git
git --version
```

**Linux:**
```bash
sudo apt install git
git --version
```

### Step 2: Navigate to Your Project

```bash
cd d:\TensedIntern\my-app
```

### Step 3: Initialize Git Repository

```bash
# Initialize git
git init

# Configure your Git user (replace with your info)
git config user.name "Your Full Name"
git config user.email "your.email@gmail.com"

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: Full-stack Tensed Intern App with scalable PostgreSQL support"
```

### Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `Tensed-Intern-App`
   - **Description**: `Full-stack job application tracking platform for interns`
   - **Public** or **Private** (your choice)
3. **Do NOT** select "Initialize with README"
4. Click "Create repository"

### Step 5: Connect and Push to GitHub

```bash
# Copy the HTTPS URL from GitHub (https://github.com/YOUR_USERNAME/Tensed-Intern-App.git)
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/Tensed-Intern-App.git
git branch -M main
git push -u origin main
```

Your code is now on GitHub! ✅

---

## 🌍 Deploy Frontend (Vercel)

### Step 1: Connect to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select `Tensed-Intern-App` repository
5. Click "Import"

### Step 2: Configure Build (Should Auto-Detect)

- **Framework**: Vite ✓
- **Build Command**: `npm run build` ✓
- **Output Directory**: `dist` ✓

### Step 3: Add Environment Variables

In Vercel dashboard under Environment Variables:
```
VITE_API_URL = https://your-backend-api-url.com/api
```

(Add this after backend is deployed - see next section)

### Step 4: Deploy

Click "Deploy" and wait (2-5 minutes)

Your frontend is now live at: `https://your-domain.vercel.app`

---

## 🔧 Deploy Backend (Choose One)

### Option A: Render (Recommended - Easiest)

#### Step 1: Create Web Service

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select `Tensed-Intern-App`
5. Configure:
   - **Name**: `tensed-intern-api`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
6. Click "Create Web Service"

#### Step 2: Add PostgreSQL Database

In Render dashboard:
1. Click "New +" → "PostgreSQL"
2. Name: `tensed-intern-db`
3. PostgreSQL Version: 15
4. Create Database

Render automatically provides connection credentials.

#### Step 3: Set Environment Variables

In Render Web Service → "Environment":

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secure-random-string-32-chars-minimum
DB_TYPE=postgres
DB_HOST=postgres-server-host.com
DB_PORT=5432
DB_NAME=tensed_intern
DB_USER=username
DB_PASSWORD=password
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

To generate JWT_SECRET, run in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 4: Deploy

Render auto-deploys when you push to GitHub. Your backend is live at: `https://your-backend.onrender.com`

---

### Option B: Railway (Alternative)

#### Step 1: Create Project

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Select "Deploy from GitHub repo"
5. Choose `Tensed-Intern-App`

#### Step 2: Add PostgreSQL

In Railway dashboard:
1. Click "Add Service" → "Database" → "PostgreSQL"
2. Railway auto-generates credentials

#### Step 3: Create Procfile

Create file: `Procfile` (in your root directory)
```
web: npm run server
```

#### Step 4: Set Environment Variables

Same as Render above.

#### Step 5: Deploy

Railway auto-deploys on GitHub push.

---

## 🗄️ Database Setup (PostgreSQL)

All of the above includes database setup. The backend automatically:

1. Connects to PostgreSQL
2. Creates all 4 tables (users, job_applications, saved_jobs, job_listings)
3. Creates performance indexes
4. Is ready to receive requests

**No additional database commands needed!**

---

## 🔄 Update Frontend with Backend URL

### After Backend is Deployed:

1. Copy your backend URL (e.g., `https://your-backend.onrender.com`)

2. Go to Vercel → Environment Variables
3. Update `VITE_API_URL = https://your-backend.onrender.com/api`

4. Redeploy on Vercel (push empty commit):
```bash
git commit --allow-empty -m "Update API URL for production"
git push origin main
```

Frontend auto-redeploys with new backend URL ✅

---

## ✅ Complete Checklist

- [ ] Git installed and configured
- [ ] Code pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render/Railway
- [ ] PostgreSQL database created
- [ ] Environment variables set on both services
- [ ] Frontend VITE_API_URL updated
- [ ] Backend FRONTEND_URL matches frontend domain
- [ ] Test registration: https://your-vercel-domain.com
- [ ] Test login and dashboard
- [ ] Test creating job applications

---

## 🧪 Test Your Deployment

1. Open `https://your-frontend.vercel.app`
2. Click "Create Account"
3. Register with test email
4. Should see dashboard
5. Try adding a job application
6. Log out and log back in
7. Application should still be there ✅

---

## 🆘 Troubleshooting

**Frontend shows "Cannot reach API"**
- [ ] Check backend URL in Vercel environment variables
- [ ] Verify backend is running: `https://your-backend.onrender.com`
- [ ] Redeploy frontend

**Backend won't start**
- [ ] Check Render/Railway logs
- [ ] Verify environment variables are set
- [ ] Ensure PostgreSQL credentials are correct

**Database connection errors**
- [ ] Check database credentials in environment variables
- [ ] Verify database is running in Render/Railway
- [ ] Check DB_TYPE is set to "postgres"

**Cannot push to GitHub**
- [ ] Verify `git remote -v` shows correct URL
- [ ] Check GitHub credentials
- [ ] Run: `git config --global user.email "your-email@gmail.com"`

---

## 📚 Documentation Files

- **README.md** - Main documentation with features and quick start
- **DEPLOYMENT_GUIDE.md** - Detailed deployment steps and scaling
- **.env.example** - Template for environment variables
- **LICENSE** - MIT License
- **server/database/schema.sql** - PostgreSQL schema with indexes

---

## 🚀 You're All Set!

Your production-ready Tensed Intern App is now:
- ✅ On GitHub with version control
- ✅ Deployed globally with Vercel + Render
- ✅ Using scalable PostgreSQL database
- ✅ Ready for thousands of users

**Next**: Monitor your apps and update your GitHub profile with the link!

For detailed information, see DEPLOYMENT_GUIDE.md in your project.
