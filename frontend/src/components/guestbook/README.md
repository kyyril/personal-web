# Firebase Guestbook Component Refactoring

This document describes the refactoring of the `FirebaseGuestbook.tsx` component into smaller, more manageable components.

## Overview

The original single-file component has been split into 4 separate components to improve maintainability and readability.

## Components Structure

### 1. `GuestbookAuth.tsx`
**Purpose:** Handles the authentication UI when user is not signed in.

**Props:**
- `onSignIn: () => void` - Function to trigger Google sign in

**Key Features:**
- Displays sign-in message
- Google sign-in button with icon
- Centered card layout

### 2. `GuestbookUserInfo.tsx`
**Purpose:** Shows authenticated user information and message form.

**Props:**
- `currentUser: { displayName: string; email: string; photoURL?: string; uid: string }`
- `message: string` - Current message input
- `onMessageChange: (message: string) => void`
- `onSubmit: (e: React.FormEvent) => void`
- `onLogOut: () => void`

**Key Features:**
- User profile display with name, email, and photo
- Logout button
- Message input form
- Welcome message

### 3. `Reply.tsx`
**Purpose:** Handles individual reply display and editing.

**Props:**
- `reply: { id: string; content: string; createdAt: string; authorId: string; author: { id: string; username: string; avatarUrl?: string } }`
- `currentUserId: string`
- `editingReply: string | null`
- `editContent: string`
- `onEditContentChange: (content: string) => void`
- `onStartEdit: (replyId: string) => void`
- `onCancelEdit: (replyId: string) => void`
- `onSaveEdit: (replyId: string) => void`
- `onDelete: (replyId: string) => void`

**Key Features:**
- Reply display with author info and timestamp
- Edit/delete buttons for own replies
- Inline editing interface
- Avatar support

### 4. `GuestbookEntry.tsx`
**Purpose:** Handles individual guestbook entries and their replies.

**Props:**
- `entry: { id: string; message: string; createdAt: string; userId: string; user: { id: string; username: string; avatarUrl?: string; email?: string }; replies: Reply[] }`
- `currentUser: { uid: string }`
- Multiple edit/reply state props
- Event handlers for all actions

**Key Features:**
- Entry display with user info
- Edit/delete buttons for own entries
- Reply system integration
- Timestamp display
- Avatar support

### 5. `index.ts`
**Purpose:** Centralized exports for all guestbook components.

## Main FirebaseGuestbook Component

The main component now:
- Manages state and data fetching
- Coordinates between child components
- Handles API calls and error management
- Passes data and callbacks to child components

## Benefits of Refactoring

1. **Single Responsibility:** Each component has one clear purpose
2. **Reusability:** Components can be reused in other parts of the app
3. **Maintainability:** Easier to debug and modify individual features
4. **Readability:** Cleaner component structure and easier to understand
5. **Testing:** Individual components can be tested in isolation
6. **Team Collaboration:** Multiple developers can work on different components

## Usage

```tsx
import { FirebaseGuestbook } from '@/components/FirebaseGuestbook';

function Page() {
  return <FirebaseGuestbook />;
}
```

The refactored components maintain all the original functionality while providing a cleaner, more maintainable codebase structure.