import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import User from '@/models/User';
import connectDB from './db';
import type { DefaultSession, JWT, Session } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        try {
          await connectDB();

          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          if (!user) {
            throw new Error('No user found with this email');
          }

          const isValid = await user.comparePassword(credentials.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Initial sign in
        token.role = user.role;
        token.id = user.id;
      } else if (trigger === "update" && session) {
        // Update token if session is updated
        token.role = session.user.role;
        token.id = session.user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days - match session maxAge
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days - match session maxAge
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
  }
  
  interface Session {
    user: {
      role?: string;
      id?: string;
    } & DefaultSession["user"]
  }

  interface JWT {
    role?: string;
    id?: string;
  }
} 