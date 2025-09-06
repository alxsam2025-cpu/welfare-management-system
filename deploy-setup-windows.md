# Quick Start Deployment - Windows Setup

## Step 1: Install Required Tools

### Install Git for Windows
1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart PowerShell after installation

### Verify Installation
Open PowerShell and run:
```powershell
git --version
node --version
npm --version
```

## Step 2: Initialize Git Repository

```powershell
# Initialize git repository
git init

# Add all files to git
git add .

# Make initial commit
git commit -m "Initial commit - Welfare Management System"
```

## Step 3: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)
```powershell
# Install GitHub CLI
winget install --id GitHub.cli

# Login to GitHub
gh auth login

# Create repository and push
gh repo create welfare-management-system --public --source=. --remote=origin --push
```

### Option B: Manual GitHub Setup
1. Go to https://github.com/new
2. Repository name: `welfare-management-system`
3. Make it Public or Private
4. Click "Create repository"
5. Run these commands in PowerShell:

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/welfare-management-system.git
git push -u origin main
```

## Step 4: Deploy to Vercel

### Install Vercel CLI
```powershell
npm install -g vercel
```

### Login and Deploy
```powershell
# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel --prod
```

## Step 5: Set Up Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your project
3. Go to "Storage" tab
4. Click "Create Database" → "Postgres"
5. Choose region and create

## Step 6: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

1. **DATABASE_URL**: Copy from Vercel Postgres dashboard
2. **NEXTAUTH_SECRET**: Generate using:
   ```powershell
   # Generate a random secret
   [System.Web.Security.Membership]::GeneratePassword(64, 0)
   ```
3. **NEXTAUTH_URL**: Your Vercel app URL (e.g., https://welfare-management-system.vercel.app)
4. **NODE_ENV**: `production`

## Step 7: Set Up Database Schema

```powershell
# Pull environment variables locally
vercel env pull .env.local

# Push database schema to production
npx prisma db push

# Create admin user
node scripts/create-admin-user.js
```

## Step 8: Test Deployment

1. Visit your Vercel URL
2. Login with admin credentials
3. Test core features

---

## Alternative: One-Click Deployment

If you prefer to skip the manual setup, you can also:

1. Push your code to GitHub first
2. Go to Vercel dashboard
3. Click "New Project"
4. Import from GitHub
5. Configure environment variables
6. Deploy

Then follow steps 5-8 above for database setup.
