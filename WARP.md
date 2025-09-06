# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a comprehensive welfare management system built with Next.js 14, TypeScript, and PostgreSQL. The system manages member data, payments, contributions, and loan management for welfare organizations.

## Essential Commands

### Development Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client and push schema to database
npm run db:generate
npm run db:push

# Create initial admin user
node scripts/create-admin-user.js

# Start development server
npm run dev
```

### Database Operations
```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database (development)
npm run db:push

# Run migrations (production-ready)
npm run db:migrate

# Open Prisma Studio for database inspection
npm run db:studio
```

### Build and Testing
```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# TypeScript type checking
npm run type-check
```

### Single Test Commands
The project doesn't currently have a test suite configured, but to add testing:
- Install Jest/Vitest: `npm install --save-dev jest @testing-library/react @testing-library/jest-dom`
- Run specific test files: `npm test -- path/to/test.test.ts`

## Architecture Overview

### Core Technology Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with Zod validation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **UI Components**: Custom components using Lucide React icons

### Database Schema Architecture
The system uses four core entities with clear relationships:

1. **User** - System authentication (Admin/User roles)
2. **Member** - Welfare organization members with financial tracking
3. **Payment** - All payment types (fees, contributions, repayments, etc.)
4. **Loan** - Loan applications with full lifecycle tracking
5. **LoanRepayment** - Individual loan repayment records

Key relationships:
- Member → Payments (one-to-many)
- Member → Loans (one-to-many) 
- Loan → LoanRepayments (one-to-many)

### Application Structure

```
src/
├── app/                     # Next.js App Router
│   ├── api/                 # Backend API routes
│   │   ├── members/         # Member CRUD operations
│   │   ├── payments/        # Payment operations  
│   │   └── loans/           # Loan management
│   ├── members/             # Member management pages
│   ├── payments/            # Payment pages
│   ├── loans/               # Loan pages
│   ├── layout.tsx           # Root layout with navigation
│   └── page.tsx             # Dashboard with statistics
├── lib/                     # Utility libraries
│   ├── prisma.ts           # Database connection singleton
│   ├── auth.ts             # NextAuth configuration
│   └── data-utils.ts       # CSV export utilities
└── components/             # Reusable React components
```

### API Design Patterns
- RESTful API routes following `/api/[resource]` convention
- Zod schemas for input validation on all API endpoints
- Consistent error handling with proper HTTP status codes
- JSON responses with standardized error formats

### Data Flow Architecture
1. **Client** → Form submission (React Hook Form + Zod)
2. **API Route** → Input validation → Database operation (Prisma)
3. **Database** → PostgreSQL with proper foreign key constraints
4. **Response** → JSON with success/error states
5. **Client** → UI updates with toast notifications

### Key Business Logic
- **Member Numbers**: Auto-generated as MEM0001, MEM0002, etc.
- **Receipt Numbers**: Auto-generated for payments and loan repayments
- **Loan Calculations**: Interest rate calculations and balance tracking
- **Payment Types**: Enum-based system (MEMBERSHIP_FEE, MONTHLY_CONTRIBUTION, etc.)
- **Loan Status Flow**: PENDING → APPROVED → DISBURSED → ACTIVE → COMPLETED

## Development Guidelines

### Database Schema Changes
1. Modify `prisma/schema.prisma`
2. Run `npm run db:generate` to update Prisma client
3. Run `npm run db:push` for development or `npm run db:migrate` for production
4. Update TypeScript interfaces and Zod schemas accordingly

### Adding New Payment Types
1. Update `PaymentType` enum in `prisma/schema.prisma`
2. Update payment forms and validation schemas
3. Regenerate Prisma client

### API Route Development
- Always use Zod for input validation
- Follow the pattern in existing routes (`src/app/api/*/route.ts`)
- Include proper error handling and status codes
- Use Prisma for database operations with proper includes/relations

### Component Development
- Components use Tailwind CSS classes
- Icons from `lucide-react` package
- Form handling with `react-hook-form`
- Toast notifications with `react-hot-toast`

### File Path Conventions
- Use `@/` alias for `src/` directory imports
- API routes: `src/app/api/[resource]/route.ts`
- Pages: `src/app/[feature]/page.tsx`
- Components: `src/components/[ComponentName].tsx`
- Utilities: `src/lib/[utility-name].ts`

## Environment Configuration

Required environment variables in `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/welfare_management"
NEXTAUTH_SECRET="your-secure-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

## Deployment Considerations

### Vercel Deployment
The project is optimized for Vercel with:
- `vercel.json` configuration
- Next.js 14 App Router support
- PostgreSQL database compatibility
- Environment variable configuration

### Database Setup
1. Requires PostgreSQL database (local or cloud)
2. Run migrations before first deployment
3. Create admin user using the provided script

### Production Checklist
1. Set up production PostgreSQL database
2. Configure environment variables in deployment platform
3. Run `npm run db:push` or migrations
4. Create initial admin user
5. Test core functionality (member creation, payments, loans)

## Security Features

- Input validation using Zod on all API endpoints
- SQL injection prevention through Prisma ORM
- Password hashing with bcryptjs
- JWT-based authentication with NextAuth.js
- Environment variable protection for sensitive data
- Cascade deletes to maintain data integrity
