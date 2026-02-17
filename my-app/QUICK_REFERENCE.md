# ⚡ Quick Reference - Copy & Paste Commands

## GitHub Setup (First Time Only)

```bash
# Navigate to project
cd d:\TensedIntern\my-app

# Initialize git
git init

# Configure user (replace with your details)
git config user.name "Your Full Name"
git config user.email "your.email@gmail.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Tensed Intern App"

# Rename branch to main
git branch -M main

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/Tensed-Intern-App.git

# Push to GitHub
git push -u origin main
```

## Regular Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message here"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View history
git log --oneline -10
```

## Environment Variables

### Generate Secure JWT Secret
```bash
# Run this command to generate random 64-char string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Example .env for Production
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_64_char_secret_here
DB_TYPE=postgres
DB_HOST=your-host.com
DB_PORT=5432
DB_NAME=tensed_intern
DB_USER=your_user
DB_PASSWORD=your_password
FRONTEND_URL=https://your-frontend.vercel.app
```

## Local Development

```bash
# Install dependencies (first time)
npm install

# Start backend server (Terminal 1)
npm run server

# Start frontend dev server (Terminal 2)
npm run dev

# Access application
# Frontend: http://localhost:5174
# Backend: http://localhost:5000

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check for linting errors
npm lint
```

## Deployment Services

### Vercel (Frontend)
```bash
# Build locally first
npm run build

# Then push to GitHub
git push origin main

# Vercel auto-deploys on GitHub push

# View deployments
# https://vercel.com/dashboard

# Redeploy (empty commit)
git commit --allow-empty -m "Redeploy to Vercel"
git push origin main
```

### Render (Backend)
```bash
# Push to GitHub - Render auto-deploys

# Force redeploy
git commit --allow-empty -m "Force redeploy on Render"
git push origin main

# View logs
# Render Dashboard → Web Service → Logs
```

## Database Management

### SQLite (Development)
```bash
# Database file location
server/database/tensed_intern.db

# Reset database (delete file)
rm server/database/tensed_intern.db
npm run server  # Creates new database

# View database (use SQLite viewer)
# Download: https://sqliteonline.com
```

### PostgreSQL (Production)
```bash
# Connect using Render credentials in environment variables

# View tables in Render
# Render Dashboard → Database → Browser

# Backup database
# Render Dashboard → Database → Settings → Backups

# Generate schema
# Run: server/database/schema.sql in PostgreSQL client
```

## Testing Endpoints

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'

# Response contains: token, user object
# Save token for next requests
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
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

### Get Applications
```bash
curl -X GET "http://localhost:5000/api/applications?status=Applied" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Health Check
```bash
curl http://localhost:5000/health

# Expected response: {"status":"ok","timestamp":"...","uptime":...}
```

## Troubleshooting Commands

### Check if ports are in use
```bash
# Windows (PowerShell)
netstat -ano | findstr ":5000"
netstat -ano | findstr ":5174"

# Mac/Linux
lsof -i :5000
lsof -i :5174
```

### Kill process on port
```bash
# Windows (PowerShell) - replace PID with actual number
taskkill /PID 1234 /F

# Mac/Linux
kill -9 1234
```

### Check Node version
```bash
node --version
npm --version
```

### Clear npm cache
```bash
npm cache clean --force
npm install
```

### Check for dependency issues
```bash
npm audit           # Check vulnerabilities
npm audit fix       # Fix vulnerabilities
npm outdated        # Check for updates
npm update          # Update packages
```

## Git Advanced Commands

### Undo last commit (not pushed)
```bash
git reset --soft HEAD~1
```

### Undo all changes to a file
```bash
git checkout -- filename.js
```

### View changes before committing
```bash
git diff
```

### Stash changes temporarily
```bash
git stash
git stash pop  # Restore changes
```

### Create and switch to new branch
```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
```

## Monitoring & Logs

### View Vercel logs
```
Vercel Dashboard → Project → Deployments → [deployment] → Logs
```

### View Render logs
```
Render Dashboard → Web Service → Logs
```

### Local development logs
```bash
# Backend logs automatically print to terminal
# Frontend logs in browser console (F12)
```

## Production Debugging

### Check frontend API calls
1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform action
4. Check request/response
5. Verify status: 200 OK

### Check backend errors
1. Go to Render Dashboard
2. Click Web Service
3. View Logs tab
4. Search for error messages

### Check database connection
1. Test health endpoint: `https://your-api.onrender.com/health`
2. Should show: `"database":"connected"`
3. If failed, check DB credentials in Environment Variables

## Database Queries (PostgreSQL)

### Connect via psql (if you have PostgreSQL installed locally)
```bash
psql -h your-host -U your-user -d tensed_intern
```

### Common queries
```sql
-- Count users
SELECT COUNT(*) FROM users;

-- Count applications
SELECT COUNT(*) FROM job_applications;

-- View all users
SELECT id, name, email FROM users;

-- View user's applications
SELECT * FROM job_applications WHERE user_id = 'user_id_here';

-- Update application status
UPDATE job_applications SET status = 'Interview Scheduled' WHERE id = 'app_id';

-- Delete test data
DELETE FROM users WHERE email = 'test@example.com';
```

## Deployment Rollback

### If frontend broke
```bash
# In Vercel Dashboard
# Deployments → [previous working deployment] → Redeploy
```

### If backend broke
```bash
# In Render Dashboard
# Web Service → Logs → [previous working version]
# Manual rollback via git:
git revert HEAD
git push origin main
```

## Performance Optimization

### Build size
```bash
npm run build
# Check: dist/ folder size should be < 500KB
```

### Database performance
```sql
-- Check table sizes (PostgreSQL)
SELECT 
  schemaname, 
  tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Useful Links

- **Vercel**: https://vercel.com/dashboard
- **Render**: https://render.com/dashboard
- **GitHub**: https://github.com
- **Node.js Docs**: https://nodejs.org/docs
- **React Docs**: https://react.dev
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Express Docs**: https://expressjs.com
- **Vite Docs**: https://vitejs.dev

## Emergency Commands

### Reset everything locally
```bash
# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall everything
npm install

# Clear git and restart
rm -rf .git
git init
git add .
git commit -m "Fresh start"
```

### Force push (careful!)
```bash
# Only if you know what you're doing
git push --force origin main
```

### Recovery from git mess
```bash
# See all your actions
git reflog

# Reset to specific state
git reset --hard HEAD~5
```

---

## Remember!

✅ Always commit before switching branches  
✅ Always pull before pushing  
✅ Never commit .env files  
✅ Always run `npm install` after cloning  
✅ Test locally before pushing to production  
✅ Keep backups of database  
✅ Monitor error logs daily  

Good luck! 🚀
