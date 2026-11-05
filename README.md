# BookNook – Online Library Management System

BookNook is a responsive online library management application where users can explore books, add and manage their own books, borrow available books, and return borrowed books.

The application is built with Next.js and communicates with a separate Express.js backend connected to MongoDB.

## Live Demo

- **Frontend:** https://booknook-client-seven.vercel.app
- **Backend API:** https://booknook-server-three-zeta.vercel.app

## Technologies Used

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Better Auth
- MongoDB
- Express.js
- React Hot Toast
- Lucide React
- Vercel

## Key Features

1. **User Authentication:** Register and log in using Better Auth.
2. **Browse Books:** Explore available books and view their details.
3. **Book Management:** Add, edit, and delete books.
4. **Borrow Books:** Borrow available books with a 14-day borrowing period.
5. **My Books:** View and manage books added by the logged-in user.
6. **My Borrows:** View all books currently borrowed by the user.
7. **Return Books:** Return borrowed books and automatically update available copies.
8. **Availability Management:** Track total and available copies of each book.
9. **Protected Pages:** Restrict access to user-specific features.
10. **Responsive Design:** Optimized for desktop, tablet, and mobile devices.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
cd booknook-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

MONGODB_URI=your_mongodb_connection_string

BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
```

Add any configured Google or GitHub OAuth credentials required by your authentication setup.

### 4. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Backend Connection

The frontend communicates with a separate Express.js backend through REST APIs.

The backend handles book management and borrowing operations, while MongoDB stores application data.

## Deployment

The frontend is deployed on Vercel.

**Live Application:** https://booknook-client-seven.vercel.app

## Author

Developed as a full-stack library management project.
