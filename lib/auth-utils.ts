import { auth } from "@/auth";
import type { UserRole } from "@/types/next-auth";

// Re-export the User type for consistency
export type { UserRole };

// Use the types from next-auth instead of redefining them
import type { User, Session } from "next-auth";

export interface ExtendedUser extends User {
  role: UserRole;
}

export interface ExtendedSession extends Session {
  user: ExtendedUser;
}

/**
 * Get the current session from the server
 */
export async function getServerSession() {
  const session = await auth();
  return session as ExtendedSession | null;
}

/**
 * Require authentication for API routes
 * Returns the session if authenticated, otherwise throws an error
 */
export async function requireAuth(): Promise<{ user: ExtendedUser }> {
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
export async function requireAdmin(): Promise<{ user: ExtendedUser }> {
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
export async function getCurrentUser(): Promise<ExtendedUser | null> {
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
