# whyer

A production-ready text-based social app built with Next.js 14, TypeScript, MongoDB, and GitHub OAuth.

## Features

- 🔐 GitHub OAuth authentication
- 📝 Create and view text-only posts (max 1000 characters)
- ♥️ Like/unlike posts
- 💬 Comment and reply to comments (one-level nesting)
- 👥 Follow/unfollow users
- 📱 Infinite scrolling feed (cursor-based pagination)
- 💌 One-to-one direct messages
- 🎨 Dark theme UI inspired by Threads

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with GitHub OAuth

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- GitHub OAuth App

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd whyer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
   - `NEXTAUTH_SECRET`: Generate a random secret (e.g., `openssl rand -base64 32`)
   - `GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID
   - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret

5. Set up GitHub OAuth:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID and Client Secret to `.env.local`

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
whyer/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── messages/          # DM pages
│   ├── post/              # Post detail pages
│   ├── profile/           # User profile pages
│   └── page.tsx           # Home feed
├── components/            # React components
├── lib/                   # Utilities (db, auth)
├── models/                # Mongoose schemas
└── middleware.ts          # Route protection
```

## API Routes

- `POST /api/posts` - Create a post
- `GET /api/posts` - Get posts (with pagination)
- `GET /api/posts/[id]` - Get a single post
- `POST /api/like` - Like/unlike a post
- `GET /api/comments` - Get comments for a post
- `POST /api/comments` - Create a comment/reply
- `POST /api/follow` - Follow/unfollow a user
- `GET /api/feed` - Get feed (posts from user + following)
- `GET /api/messages` - Get messages between users
- `POST /api/messages` - Send a message
- `GET /api/users/[username]` - Get user by username

## Database Models

- **User**: githubId, username, name, avatar, bio, followers, following
- **Post**: author, content, likes, createdAt
- **Comment**: post, author, content, parentComment, createdAt
- **Message**: sender, receiver, content, createdAt

## License

MIT
