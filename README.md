# Welfare Management System

A comprehensive web-based welfare management system built with Next.js, TypeScript, and PostgreSQL. This system helps organizations manage member data, track payments and contributions, and handle loan management with ease.

## Features

### 👥 Member Management
- Add, view, and manage member profiles
- Track member status (Active, Inactive, Suspended)
- Store personal information (name, email, phone, address, date of birth)
- Auto-generate unique member numbers
- Export member data to CSV

### 💰 Payment Tracking
- Record various payment types:
  - Membership fees
  - Monthly contributions
  - Special levies
  - Loan repayments
  - Fines
  - Other payments
- Auto-generate receipt numbers
- Track payment history
- Export payment data to CSV
- Search and filter payments

### 🏦 Loan Management
- Loan application processing
- Interest rate calculations
- Track loan status (Pending, Approved, Disbursed, Active, Completed, Defaulted)
- Repayment tracking
- Loan balance management

### 📊 Dashboard & Reports
- Overview dashboard with key statistics
- Recent activity tracking
- Financial summaries
- Export capabilities for all data

### 🔒 Security & Authentication
- Basic authentication system
- User roles (Admin, User)
- Secure API endpoints

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Deployment**: Vercel-ready configuration
- **Data Export**: CSV export functionality

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git (optional, for version control)

### Installation

1. **Clone or download the project**
   ```bash
   # If using Git
   git clone <your-repository-url>
   cd welfare-management-system
   
   # If downloaded as ZIP, extract and navigate to the folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your database and authentication settings:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/welfare_management"
   NEXTAUTH_SECRET="your-secure-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Optional: Open Prisma Studio to view/edit data
   npx prisma studio
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment on Vercel

This project is optimized for deployment on Vercel. Follow these steps:

### 1. Prepare Your Database

You'll need a PostgreSQL database. Options include:

- **Vercel Postgres** (Recommended)
- **Supabase** (Free tier available)
- **Railway** (Free tier available)
- **Amazon RDS**
- **Google Cloud SQL**

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables
5. Deploy

### 3. Configure Environment Variables

In your Vercel dashboard, add these environment variables:

```
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_secure_random_secret
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### 4. Run Database Setup

After deployment, you may need to set up your production database:

```bash
# Set your production DATABASE_URL
DATABASE_URL="your_production_url" npx prisma db push
```

## Project Structure

```
welfare-management-system/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── members/       # Member CRUD operations
│   │   │   └── payments/      # Payment operations
│   │   ├── members/           # Member management pages
│   │   ├── payments/          # Payment management pages
│   │   ├── loans/             # Loan management pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard page
│   ├── components/            # Reusable React components
│   └── lib/                   # Utility functions
│       ├── prisma.ts          # Database connection
│       └── data-utils.ts      # Import/export utilities
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel deployment configuration
```

## Usage Guide

### Adding Members
1. Navigate to the Members section
2. Click "Add Member"
3. Fill in the required information
4. Submit the form

### Recording Payments
1. Go to the Payments section
2. Click "Record Payment"
3. Select the member and payment type
4. Enter the amount and any notes
5. Submit the payment

### Managing Loans
1. Access the Loans section
2. Create new loan applications
3. Track approval and disbursement
4. Monitor repayments

### Exporting Data
- Each section (Members, Payments, Loans) has an "Export" button
- Data is exported as CSV files
- Files include all relevant information for the selected section

## Database Schema

The system uses four main models:

- **Member**: Personal information and financial summaries
- **Payment**: Individual payment records
- **Loan**: Loan applications and tracking
- **LoanRepayment**: Individual loan repayment records
- **User**: System authentication

## API Endpoints

- `GET/POST /api/members` - Member management
- `GET/POST /api/payments` - Payment operations
- `GET/POST /api/loans` - Loan management

## Security Features

- Environment variable protection for sensitive data
- Input validation using Zod
- SQL injection prevention through Prisma ORM
- Authentication-ready architecture

## Customization

### Adding New Payment Types
Edit the PaymentType enum in `prisma/schema.prisma`:
```prisma
enum PaymentType {
  MEMBERSHIP_FEE
  MONTHLY_CONTRIBUTION
  SPECIAL_LEVY
  LOAN_REPAYMENT
  FINE
  OTHER
  YOUR_CUSTOM_TYPE  // Add here
}
```

### Modifying Member Fields
Add new fields to the Member model in `prisma/schema.prisma` and update the forms accordingly.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your DATABASE_URL in `.env.local`
   - Ensure your PostgreSQL server is running
   - Check firewall settings

2. **Build Errors**
   - Run `npm run type-check` to check for TypeScript errors
   - Ensure all dependencies are installed with `npm install`

3. **Prisma Issues**
   - Run `npx prisma generate` after schema changes
   - Use `npx prisma db push` to sync database changes

### Getting Help

1. Check the browser console for error messages
2. Review the server logs in your terminal
3. Verify environment variables are set correctly
4. Ensure your database is accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For support and questions, please create an issue in the project repository or contact your system administrator.

---

**Built with ❤️ for welfare organizations everywhere**
