import type { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  
  interface User {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

// Use a named function to create the auth config
export function getAuthConfig(): AuthOptions {
  return {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const WORKSHOP_PASSWORD = "Workshop";
        
        if (!credentials?.password) {
          return null;
        }

        if (credentials.password !== WORKSHOP_PASSWORD) {
          throw new Error("Invalid password");
        }

        return {
          id: "1",
          name: "Workshop User",
          email: "user@example.com",
          role: "USER"
        } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as User).role || 'USER';
      }
      // Update token with session data if needed
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: (token.role as string) || 'USER',
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signOut() {
      // Handle sign out events
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
    debug: process.env.NODE_ENV === "development",
  };
}

// Export the config for use in the app
export const authConfig = getAuthConfig();
