# Authentication Setup

This project includes basic authentication using NextAuth.js with credentials provider.

## Initial Setup

After setting up your database and running migrations, you need to create an admin user:

### 1. Create Admin User

Run the admin user creation script:

```bash
node scripts/create-admin-user.js
```

This will create a default admin user with:
- **Email**: admin@welfare.com
- **Password**: admin123

**⚠️ IMPORTANT**: Change this password immediately after first login in production!

### 2. Environment Variables

Make sure your `.env.local` file includes:

```env
NEXTAUTH_SECRET="your-secure-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## How Authentication Works

### 1. Route Protection
- All routes except `/auth/*` and `/api/*` require authentication
- Users are redirected to `/auth/signin` if not authenticated

### 2. User Roles
- **ADMIN**: Full access to all features
- **USER**: Standard access (can be customized for limited permissions)

### 3. Session Management
- Sessions use JWT tokens
- Tokens include user ID, email, name, and role
- Sessions persist across browser sessions

## Usage

### 1. Sign In
Navigate to `/auth/signin` or you'll be redirected automatically when accessing protected routes.

### 2. Session Access
In your components, use NextAuth's `useSession` hook:

```typescript
import { useSession } from 'next-auth/react'

export function MyComponent() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>
  if (status === 'unauthenticated') return <p>Not authenticated</p>

  return <p>Welcome {session?.user?.name}!</p>
}
```

### 3. API Route Protection
API routes are currently open but can be protected by adding auth checks:

```typescript
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Your protected API logic here
}
```

## Creating Additional Users

Users can be created through the database directly or by adding a user management interface:

1. **Via Database**: Insert directly into the `User` table with hashed password
2. **Via Script**: Modify `scripts/create-admin-user.js` to create different users
3. **Via UI**: Build a user management interface for admins

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based sessions
- ✅ Route protection middleware
- ✅ Secure password comparison
- ✅ Environment-based configuration

## Customization

### Adding More Providers
Edit `src/lib/auth.ts` to add additional providers like Google, GitHub, etc:

```typescript
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  // ... existing providers
]
```

### Role-Based Access Control
Modify the middleware or add route-specific auth checks for different user roles.

### Custom Sign-In Page
The current setup redirects to `/auth/signin`. You can create a custom sign-in page at this route or modify the redirect in `authOptions`.

## Production Considerations

1. **Change Default Credentials**: Always change the default admin password
2. **Secure Secret**: Use a strong, randomly generated `NEXTAUTH_SECRET`
3. **HTTPS**: Always use HTTPS in production
4. **Database Security**: Ensure your database is properly secured
5. **Rate Limiting**: Consider adding rate limiting to auth endpoints

## Troubleshooting

### Common Issues

1. **"Invalid credentials" error**: Check that the password is correct and the user exists
2. **Redirect loops**: Ensure `NEXTAUTH_URL` matches your domain
3. **Database connection errors**: Verify your `DATABASE_URL` is correct
4. **Session not persisting**: Check that `NEXTAUTH_SECRET` is set correctly

### Debugging

Enable debug mode in development:
```env
NEXTAUTH_DEBUG=true
```

This will log detailed authentication information to the console.
