import NextAuth from "next-auth";
import { NextAuthConfig } from "next-auth";

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

const authConfig: NextAuthConfig = {
  providers: [
    {
      id: "credentials",
      name: "Password",
      type: "credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
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
          email: "workshop@example.com",
          role: "USER",
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  events: {
    async signOut() {
      // Handle any cleanup on sign out
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export { authConfig };

export const { handlers: { GET, POST } } = NextAuth(authConfig);
