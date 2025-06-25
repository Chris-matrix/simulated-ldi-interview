import { auth } from "@/auth";
import type { DefaultSession } from "next-auth";

export type UserRole = "USER" | "ADMIN";

// Define the user type
export interface User {
  id: string;
  role: UserRole;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Define the session type
export interface Session {
  user: User;
  expires: string;
}

// Extend the default session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
  
  interface User {
    role: UserRole;
  }
}

/**
 * Get the current session from the server
 */
export async function getServerSession() {
  const session = await auth();
  return session as Session | null;
}

/**
 * Require authentication for API routes
 * Returns the session if authenticated, otherwise throws an error
 */
export async function requireAuth(): Promise<{ user: User }> {
  const session = await getServerSession();
  
  if (!session) {
    throw new Error("You must be logged in to access this resource");
  }

  return { user: session.user };
}

/**
 * Require admin role for API routes
 * Returns the user if admin, otherwise throws an error
 */
export async function requireAdmin(): Promise<{ user: User }> {
  const { user } = await requireAuth();

  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  return { user };
}

/**
 * Get the current user from the session
 * For use in React components
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getServerSession();
    return session?.user || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  try {
    const session = await getServerSession();
    return session?.user.role === role;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
}

/**
 * Check if the current user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  try {
    const session = await getServerSession();
    return roles.some(role => session?.user.role === role);
  } catch (error) {
    console.error("Error checking roles:", error);
    return false;
  }
}

/**
 * Get the current user's role
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}
