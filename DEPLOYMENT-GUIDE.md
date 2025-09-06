# Deployment Guide - Welfare Management System

This guide provides step-by-step instructions for deploying your welfare management system to production.

## Deployment Options

### Option 1: Vercel + Vercel Postgres (Recommended - Easiest)
### Option 2: Vercel + External Database (Supabase/Railway)
### Option 3: Manual VPS Deployment

---

## Option 1: Vercel + Vercel Postgres (Recommended)

### Step 1: Prepare Your Code

1. **Ensure all changes are committed to Git**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   ```

2. **Push to GitHub** (create repository if needed):
   ```bash
   # If you haven't initialized git yet
   git init
   git branch -M main
   git remote add origin https://github.com/yourusername/welfare-management-system.git
   git push -u origin main
   ```

### Step 2: Create Vercel Account and Project

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Step 3: Set Up Vercel Postgres Database

1. In your Vercel dashboard, go to your project
2. Navigate to the "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a region close to your users
6. Click "Create"

### Step 4: Configure Environment Variables

1. In Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add the following variables:

   ```env
   DATABASE_URL=
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=
   NODE_ENV=production
   ```

3. **For DATABASE_URL**: Copy from Vercel Postgres dashboard
4. **For NEXTAUTH_SECRET**: Generate a secure random string:
   ```bash
   # In PowerShell
   [System.Web.Security.Membership]::GeneratePassword(64, 0)
   
   # Or use online generator: https://generate-secret.vercel.app/32
   ```
5. **For NEXTAUTH_URL**: Use your Vercel deployment URL (e.g., `https://your-app-name.vercel.app`)

### Step 5: Deploy and Set Up Database

1. **Trigger deployment**: Push to main branch or redeploy in Vercel
2. **Once deployed, set up database schema**:
   ```bash
   # Install Vercel CLI if not already installed
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link your local project to Vercel project
   vercel link
   
   # Push database schema to production
   vercel env pull .env.local
   npx prisma db push
   ```

### Step 6: Create Admin User

1. **Modify the admin creation script for production**:
   ```bash
   # Edit scripts/create-admin-user.js to use production DATABASE_URL
   # Or create a temporary production script
   ```

2. **Create admin user**:
   ```bash
   node scripts/create-admin-user.js
   ```

### Step 7: Test Your Deployment

1. Visit your Vercel URL
2. Test login with admin credentials
3. Test core functionality:
   - Add a member
   - Record a payment
   - Create a loan application

---

## Option 2: Vercel + External Database

### Step 2A: Set Up Database (Choose one)

#### Using Supabase (Free tier available)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Settings → Database
4. Copy connection string (looks like: `postgresql://postgres:[password]@[host]/postgres`)

#### Using Railway (Free tier available)

1. Go to [railway.app](https://railway.app) and create account
2. Create new project
3. Add PostgreSQL service
4. Go to PostgreSQL service → Variables tab
5. Copy `DATABASE_URL`

### Step 2B: Follow Vercel Deployment Steps

Follow Steps 1, 2, 4, 5, 6, 7 from Option 1, but use your external database URL for `DATABASE_URL`.

---

## Option 3: Manual VPS Deployment

### Step 1: Prepare VPS Server

1. **Get a VPS** (DigitalOcean, Linode, AWS EC2, etc.)
2. **Connect to server**:
   ```bash
   ssh root@your-server-ip
   ```

### Step 2: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL
apt install postgresql postgresql-contrib -y

# Install PM2 for process management
npm install -g pm2

# Install Nginx for reverse proxy
apt install nginx -y
```

### Step 3: Set Up PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE welfare_management;
CREATE USER welfare_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE welfare_management TO welfare_user;
\q
```

### Step 4: Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/welfare-management-system.git
cd welfare-management-system

# Install dependencies
npm install

# Create environment file
nano .env.local
```

Add to `.env.local`:
```env
DATABASE_URL="postgresql://welfare_user:secure_password_here@localhost:5432/welfare_management"
NEXTAUTH_SECRET="your-super-secure-secret-key-64-characters-long"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

```bash
# Set up database
npx prisma generate
npx prisma db push

# Create admin user
node scripts/create-admin-user.js

# Build application
npm run build

# Start with PM2
pm2 start npm --name "welfare-system" -- start
pm2 startup
pm2 save
```

### Step 5: Configure Nginx

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/welfare-system
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/welfare-system /etc/nginx/sites-enabled/
systemctl restart nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
certbot renew --dry-run
```

---

## Post-Deployment Checklist

### Security Verification
- [ ] HTTPS is working properly
- [ ] Database connection is secure
- [ ] Environment variables are not exposed
- [ ] Admin login works
- [ ] No sensitive data in git repository

### Functionality Testing
- [ ] Dashboard loads correctly
- [ ] Member creation works
- [ ] Payment recording works
- [ ] Loan application works
- [ ] Data export functions work
- [ ] Authentication flow works

### Performance Optimization
- [ ] Database queries are optimized
- [ ] Static assets are served efficiently
- [ ] Application starts quickly
- [ ] Memory usage is reasonable

---

## Monitoring and Maintenance

### Vercel Deployment
- Monitor through Vercel dashboard
- Check function logs for errors
- Monitor database usage in Vercel Postgres dashboard

### VPS Deployment
- Monitor with PM2: `pm2 status`, `pm2 logs`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`
- Monitor system resources: `htop`, `df -h`

### Regular Maintenance
- Update dependencies monthly: `npm audit` and `npm update`
- Monitor database size and performance
- Backup database regularly
- Review and rotate logs

---

## Troubleshooting Common Issues

### Database Connection Issues
```bash
# Test database connection
npx prisma db push

# Check if database is accessible
psql $DATABASE_URL -c "SELECT 1;"
```

### Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Environment Variable Issues
```bash
# Verify environment variables are loaded
node -e "console.log(process.env.DATABASE_URL)"
```

---

## Cost Considerations

### Vercel + Vercel Postgres
- **Free tier**: Good for testing and small usage
- **Pro**: ~$20/month for production apps
- **Database**: Additional cost based on usage

### External Database Options
- **Supabase**: Free tier available, paid plans start ~$25/month
- **Railway**: Free tier available, paid plans start ~$5/month
- **AWS RDS**: Variable pricing, typically $15-50/month for small instances

### VPS Deployment
- **DigitalOcean Droplet**: $5-10/month for basic setup
- **Domain**: $10-15/year
- **SSL**: Free with Let's Encrypt

---

## Support and Next Steps

After successful deployment:
1. Share access credentials with relevant staff
2. Set up regular backups
3. Plan for scaling if user base grows
4. Consider implementing monitoring and alerting
5. Document any customizations for your organization

Remember to keep your deployment documentation updated and test backup/restore procedures regularly.
