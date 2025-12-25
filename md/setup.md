# Environment Setup Guide

## Local Development vs Production

You don't need to change any code when switching between local and production. The app automatically uses different environment variables based on where it's running.

## How It Works

### Local Development
- Uses `.env.local` file (not committed to git)
- `NEXTAUTH_URL=http://localhost:3000`
- Uses local MongoDB or MongoDB Atlas
- GitHub OAuth callback: `http://localhost:3000/api/auth/callback/github`

### Production (Vercel)
- Uses environment variables set in Vercel dashboard
- `NEXTAUTH_URL=https://whyer.vercel.app`
- Uses production MongoDB
- GitHub OAuth callback: `https://whyer.vercel.app/api/auth/callback/github`

## Setup Instructions

### For Local Development

1. **Create `.env.local` file** (copy from `.env.example`):
```bash
cp .env.example .env.local
```

2. **Fill in your local values**:
```env
MONGODB_URI=mongodb://localhost:27017/whyer
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whyer

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_local_secret_here

GITHUB_CLIENT_ID=your_local_github_client_id
GITHUB_CLIENT_SECRET=your_local_github_client_secret
```

3. **GitHub OAuth Setup for Local**:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a NEW OAuth App (or use existing one)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID and Secret to `.env.local`

### For Production (Vercel)

1. **Set environment variables in Vercel**:
   - Go to your Vercel project → Settings → Environment Variables
   - Add these variables:
     - `MONGODB_URI` = Your production MongoDB URI
     - `NEXTAUTH_URL` = `https://whyer.vercel.app`
     - `NEXTAUTH_SECRET` = Your production secret
     - `GITHUB_CLIENT_ID` = Your production GitHub Client ID
     - `GITHUB_CLIENT_SECRET` = Your production GitHub Client Secret

2. **GitHub OAuth Setup for Production**:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Edit your OAuth App (or create a separate one for production)
   - **Authorization callback URL**: `https://whyer.vercel.app/api/auth/callback/github`
   - Copy Client ID and Secret to Vercel environment variables

## Option 1: Separate OAuth Apps (Recommended)

**Local OAuth App:**
- Callback URL: `http://localhost:3000/api/auth/callback/github`
- Use in `.env.local`

**Production OAuth App:**
- Callback URL: `https://whyer.vercel.app/api/auth/callback/github`
- Use in Vercel environment variables

## Option 2: Single OAuth App with Multiple Callbacks

GitHub allows multiple callback URLs in one OAuth App:
- Add both URLs in GitHub OAuth App settings:
  - `http://localhost:3000/api/auth/callback/github`
  - `https://whyer.vercel.app/api/auth/callback/github`
- Use the same Client ID and Secret for both local and production

## Important Notes

1. **`.env.local` is gitignored** - Your local secrets won't be committed
2. **Never commit `.env.local`** - It's already in `.gitignore`
3. **Vercel variables are separate** - Changes in Vercel don't affect local
4. **Code stays the same** - The app automatically uses the right variables based on environment

## Quick Check

To verify your setup:

**Local:**
```bash
npm run dev
# Should work with .env.local values
```

**Production:**
- Check Vercel dashboard → Settings → Environment Variables
- All variables should be set correctly

## Troubleshooting

**Issue: Local auth not working**
- Check `.env.local` exists and has correct values
- Verify `NEXTAUTH_URL=http://localhost:3000` (no trailing slash)
- Check GitHub OAuth callback URL matches

**Issue: Production auth not working**
- Check Vercel environment variables are set
- Verify `NEXTAUTH_URL=https://whyer.vercel.app` (no trailing slash)
- Redeploy after changing environment variables

