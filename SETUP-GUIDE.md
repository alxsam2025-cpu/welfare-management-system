# 🚀 Setup & Installation Guide

## Welfare Management System - Complete Setup Instructions

This guide will walk you through setting up the Welfare Management System with the comprehensive loan application features on your local machine or server.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Usually comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### Database Options
Choose one of the following databases:

#### Option 1: PostgreSQL (Recommended)
- **PostgreSQL** (v13 or higher) - [Download here](https://www.postgresql.org/download/)
- Create a database for the application

#### Option 2: MySQL
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- Create a database for the application

#### Option 3: SQLite (Development Only)
- No installation required - file-based database

## 🛠️ Installation Steps

### 1. Clone or Download the Repository

```bash
# If using Git
git clone <repository-url>
cd welfare-management-system

# Or download and extract the ZIP file
```

### 2. Install Dependencies

```bash
# Install all required packages
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
# Choose one of the following based on your database:

# For PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/welfare_db"

# For MySQL
DATABASE_URL="mysql://username:password@localhost:3306/welfare_db"

# For SQLite (Development only)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here-make-it-long-and-random"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration (for notifications)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# Admin Configuration
ADMIN_EMAIL="admin@welfare.org"
ADMIN_NAME="System Administrator"

# File Upload Configuration
MAX_FILE_SIZE="10485760" # 10MB in bytes
UPLOAD_PATH="public/uploads"

# Application Configuration
APP_NAME="Welfare Management System"
APP_URL="http://localhost:3000"
```

### 4. Database Setup

#### Generate Prisma Client
```bash
npx prisma generate
```

#### Database Migration (First Time Setup)
```bash
# Push schema to database (creates tables)
npx prisma db push
```

#### Alternative: Use Migrations (Production)
```bash
# Create and run migrations
npx prisma migrate dev --name init
```

#### Verify Database Setup
```bash
# Open Prisma Studio to view your database
npx prisma studio
```

### 5. Create Required Directories

```bash
# Create upload directories
mkdir -p public/uploads/loan-applications
mkdir -p public/uploads/member-documents

# Set permissions (Linux/Mac only)
chmod 755 public/uploads
chmod 755 public/uploads/loan-applications
chmod 755 public/uploads/member-documents
```

### 6. Seed Initial Data (Optional)

Create an admin user and sample data:

```bash
# Create seed file if not exists
npm run db:seed
```

If the seed script doesn't exist, you can create one manually:

**Create `prisma/seed.ts`:**
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@welfare.org' },
    update: {},
    create: {
      email: 'admin@welfare.org',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'ADMIN'
    }
  })

  // Create sample members
  const sampleMembers = [
    {
      memberNumber: 'WMS001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, City'
    },
    {
      memberNumber: 'WMS002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      address: '456 Oak Ave, City'
    }
  ]

  for (const memberData of sampleMembers) {
    await prisma.member.upsert({
      where: { email: memberData.email },
      update: {},
      create: memberData
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Run the seed:
```bash
npx tsx prisma/seed.ts
```

### 7. Start the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:3000`

## 🔧 Production Setup

### 1. Build the Application

```bash
npm run build
```

### 2. Start Production Server

```bash
npm start
```

### 3. Environment Variables for Production

Update your `.env` file for production:

```env
# Production Database
DATABASE_URL="your-production-database-url"

# Security
NEXTAUTH_SECRET="very-long-random-string-for-production"
NEXTAUTH_URL="https://your-domain.com"

# Email (Production SMTP)
EMAIL_HOST="your-smtp-server.com"
EMAIL_PORT="587"
EMAIL_USER="noreply@your-domain.com"
EMAIL_PASSWORD="your-smtp-password"

# Admin
ADMIN_EMAIL="admin@your-domain.com"

# App Configuration
APP_URL="https://your-domain.com"
```

## 📁 Project Structure

```
welfare-management-system/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── loans/             # Loan-related pages
│   │   ├── members/           # Member management pages
│   │   └── payments/          # Payment pages
│   ├── components/            # React components
│   │   ├── LoanApplicationForm.tsx
│   │   ├── LoanApplicationManager.tsx
│   │   ├── LoanDisbursementWorkflow.tsx
│   │   └── Navigation.tsx
│   └── lib/                   # Utility functions
│       └── notifications.ts   # Email notifications
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── public/
│   └── uploads/              # File upload directory
├── .env                      # Environment variables
└── package.json
```

## 🧪 Testing the Setup

### 1. Verify Database Connection
- Open `http://localhost:3000/api/health` (if you create a health check endpoint)
- Or run: `npx prisma studio` to view the database

### 2. Test Core Features
1. **Member Management:**
   - Navigate to `/members`
   - Add a new member
   - Import members from CSV

2. **Payment Tracking:**
   - Go to `/payments`
   - Record a payment
   - View payment reports

3. **Loan Applications:**
   - Visit `/loans/new`
   - Complete the loan application form
   - Upload required documents
   - Check application status

4. **Admin Features:**
   - Access `/loans` for loan management
   - Review applications
   - Approve/reject applications
   - Disburse loans

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues
```bash
# Check if database is running
# For PostgreSQL
pg_isready -h localhost -p 5432

# For MySQL
mysqladmin ping -h localhost -P 3306 -u root -p

# Reset database
npx prisma db push --force-reset
```

#### File Upload Issues
```bash
# Check directory permissions
ls -la public/uploads/

# Fix permissions (Linux/Mac)
chmod -R 755 public/uploads/
```

#### Environment Variables Not Loading
```bash
# Restart development server after .env changes
npm run dev
```

#### Prisma Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

#### Email Notifications Not Working
- Check SMTP settings in `.env`
- For Gmail: Use App Passwords, not regular password
- Test email configuration with a simple test

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Type check
npx tsc --noEmit
```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Change default admin password
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS in production
- [ ] Restrict file upload types and sizes
- [ ] Implement rate limiting
- [ ] Enable CORS restrictions
- [ ] Use environment variables for all secrets
- [ ] Regular database backups
- [ ] Monitor file upload directory

### File Upload Security
```javascript
// Allowed file types for document uploads
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/csv'
]

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024
```

## 📊 Database Backup

### Backup Commands

#### PostgreSQL
```bash
pg_dump -U username -h localhost welfare_db > backup.sql
```

#### MySQL
```bash
mysqldump -u username -p welfare_db > backup.sql
```

### Restore Commands

#### PostgreSQL
```bash
psql -U username -h localhost welfare_db < backup.sql
```

#### MySQL
```bash
mysql -u username -p welfare_db < backup.sql
```

## 🔄 Updates and Maintenance

### Regular Maintenance Tasks

1. **Database Maintenance:**
   ```bash
   # Update database schema
   npx prisma db push
   
   # Backup database regularly
   ```

2. **File Cleanup:**
   ```bash
   # Clean old uploaded files (implement custom script)
   # Monitor disk space usage
   ```

3. **Dependencies:**
   ```bash
   # Check for updates
   npm audit
   npm update
   ```

## 📞 Support

### Getting Help

1. **Check the documentation** in this file first
2. **Review error logs** in the console or log files
3. **Check GitHub issues** (if applicable)
4. **Database issues:** Check Prisma documentation
5. **Email issues:** Verify SMTP settings

### Log Locations
- **Next.js logs:** Console output
- **Database logs:** Check your database server logs
- **File upload logs:** Console output

## 🎉 Congratulations!

If you've followed this guide successfully, you now have a fully functional Welfare Management System with:

- ✅ Member management
- ✅ Payment tracking
- ✅ Comprehensive loan application system
- ✅ Document upload and management
- ✅ Admin management interface
- ✅ Email notifications
- ✅ Mobile-responsive design

## 📈 Next Steps

1. **Customize** the system for your organization's needs
2. **Add** additional features as required
3. **Configure** email templates for your organization
4. **Train** your team on using the system
5. **Set up** regular backups and monitoring
6. **Consider** deploying to a cloud platform for production use

## 🌟 Advanced Features Available

The system includes many advanced features ready for use:

- **Multi-step loan applications** with document upload
- **Automated payment scheduling** and reminders
- **Financial analytics** and reporting
- **Role-based access control**
- **Audit trails** for all transactions
- **Email notification system**
- **Mobile-responsive** design
- **CSV import/export** functionality

---

**Welcome to your new Welfare Management System! 🎊**

For any questions or issues, please refer to the troubleshooting section or check the system documentation.
