import { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import connectDB from './db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        try {
          await connectDB();
          
          // Check if user exists, if not create one
          const existingUser = await User.findOne({ githubId: account.providerAccountId });
          
          if (!existingUser) {
            // Create new user document
            const username = (profile as any)?.login || user.name?.toLowerCase().replace(/\s+/g, '') || `user${Date.now()}`;
            
            // Ensure username is unique
            let uniqueUsername = username;
            let counter = 1;
            while (await User.findOne({ username: uniqueUsername })) {
              uniqueUsername = `${username}${counter}`;
              counter++;
            }
            
            await User.create({
              githubId: account.providerAccountId,
              username: uniqueUsername,
              name: user.name || (profile as any)?.name || 'User',
              avatar: user.image || (profile as any)?.avatar_url || '',
              bio: (profile as any)?.bio || '',
            });
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
          // Log more details for debugging
          if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
          }
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      try {
        // On first sign-in, account and profile are available
        if (account?.provider === 'github' && account.providerAccountId) {
          await connectDB();
          const user = await User.findOne({ githubId: account.providerAccountId });
          if (user) {
            token.userId = user._id.toString();
            token.username = user.username;
            token.sub = account.providerAccountId;
          }
        } else if (token.sub) {
          // On subsequent requests, fetch user data from token.sub (GitHub ID)
          await connectDB();
          const user = await User.findOne({ githubId: token.sub });
          if (user) {
            token.userId = user._id.toString();
            token.username = user.username;
          }
        }
      } catch (error) {
        console.error('Error in JWT callback:', error);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

