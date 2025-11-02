# Firebase Guestbook Integration Guide

## 🎉 Complete Integration Overview

Your Firebase-authenticated guestbook system is now fully implemented! Here's everything you need to know:

## ✅ What's Been Implemented

### Backend (Elysia + Firebase Admin)
- **Authentication Middleware**: Firebase token verification
- **CRUD APIs**: Full guestbook and replies operations
- **Database**: PostgreSQL with Prisma ORM
- **Public Access**: GET endpoints for viewing without auth

### Frontend (Next.js + Firebase Auth)
- **OAuth Integration**: Google sign-in with Firebase
- **Auth Context**: User state management
- **CRUD Interface**: Create, Read, Update, Delete operations
- **Replies System**: Full replies functionality
- **Responsive UI**: Beautiful guestbook interface

## 🚀 Quick Setup Steps

### 1. Get Firebase Web App Configuration

You need to get these values from your Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `personal-web-990d0`
3. Go to Project Settings > General > Your apps
4. Add a web app (if not already created)
5. Copy the configuration object

Update your `.env.local` file:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Run Data Migration

Execute these SQL commands in your Neon PostgreSQL database:

```sql
-- First, import users
-- Copy and run: `backend/migrasiDB/users_migration.sql`

-- Second, import guestbook entries
-- Copy and run: `backend/migrasiDB/guestbook_entries_migration.sql`
```

### 3. Start Both Servers

```bash
# Terminal 1: Start Backend (Elysia)
cd backend
bun run dev

# Terminal 2: Start Frontend (Next.js)
npm run dev
```

### 4. Test the Integration

1. Open `http://localhost:3000/guestbook`
2. Click "Sign in with Google"
3. Authorize with your Google account
4. Start posting messages and replies!

## 🔧 API Endpoints

### Public Endpoints
- `GET /guestbook` - View all guestbook entries
- `GET /test/db` - Database connection test

### Protected Endpoints (Require Firebase Auth)
- `POST /guestbook/auth` - Create new entry
- `PUT /guestbook/auth/:id` - Update entry
- `DELETE /guestbook/auth/:id` - Delete entry
- `POST /replies` - Create reply
- `PUT /replies/:id` - Update reply
- `DELETE /replies/:id` - Delete reply

## 📱 Frontend Features

### Authentication
- ✅ Google OAuth integration
- ✅ User session management
- ✅ Token-based API calls
- ✅ Automatic user creation

### Guestbook Operations
- ✅ Create new messages
- ✅ Edit your own messages
- ✅ Delete your own messages
- ✅ View all messages (public)

### Replies System
- ✅ Reply to any message
- ✅ Edit your own replies
- ✅ Delete your own replies
- ✅ Real-time reply display

## 🛠 Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:3000/test/db

# Check database connection
curl http://localhost:3000/guestbook
```

### Frontend Issues
- Ensure `.env.local` has correct Firebase config
- Check browser console for authentication errors
- Verify backend is running on port 3000

### Common Errors

1. **"Firebase not configured"**
   - Update `.env.local` with actual Firebase web app config

2. **"Unauthorized" errors**
   - Check if user is properly signed in
   - Verify Firebase token is being sent

3. **Database connection errors**
   - Check your Neon database connection
   - Verify `DATABASE_URL` in backend `.env`

## 📋 Complete File Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── config/firebase.ts       # Firebase Admin config
│   │   ├── middleware/auth.ts       # Authentication middleware
│   │   ├── routes/
│   │   │   ├── guestbook.ts         # Guestbook CRUD API
│   │   │   ├── replies.ts           # Replies CRUD API
│   │   │   └── test.ts              # Testing endpoints
│   │   └── generated/prisma/        # Generated Prisma client
│   ├── .env                         # Backend environment
│   └── migrasiDB/                   # Data migration files
├── src/
│   ├── components/FirebaseGuestbook.tsx  # Main guestbook component
│   ├── contexts/AuthContext.tsx          # Authentication context
│   ├── lib/firebase.ts                  # Firebase client config
│   └── app/guestbook/page.tsx           # Guestbook page
├── .env.local                         # Frontend environment
└── Firebase service account JSON      # Backend authentication
```

## 🎯 Next Steps

1. **Get Firebase Web Config**: Complete the `.env.local` setup
2. **Run Migration**: Execute the SQL files in your database
3. **Test Everything**: Try all CRUD operations
4. **Deploy**: Set up production Firebase project

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables are correct
3. Ensure both servers are running
4. Test API endpoints directly with curl

Your Firebase guestbook system is ready to use! 🚀