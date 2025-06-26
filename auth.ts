import NextAuth from "next-auth";
import { getAuthConfig } from "./auth.config";

// Initialize NextAuth with configuration
const handler = NextAuth(getAuthConfig());

// Export the handler for API routes
export { handler as GET, handler as POST };

// Export auth functions for server components
export const auth = handler.auth;

// Export auth utilities for client components
export const signIn = handler.signIn;
export const signOut = handler.signOut;

// Re-export types for convenience
export type { Session, User } from "next-auth";
