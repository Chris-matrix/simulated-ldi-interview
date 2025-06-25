import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { User as NextAuthUser } from "next-auth";
import type { UserRole } from "@/types/next-auth";

export interface User extends NextAuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}

export interface Session {
  user: User;
  expires: string;
}

/**
 * Get the current session
 * For use in Server Components and API routes
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const session = await auth();
    return session as Session | null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Require authentication for API routes and server components
 * Returns the user if authenticated, otherwise redirects to login
 */
export async function requireAuth(redirectTo: string = '/login'): Promise<{ user: User }> {
  const session = await getServerSession();
  
  if (!session) {
    if (typeof window === 'undefined') {
      // Server-side redirect
      redirect(redirectTo);
    } else {
      // Client-side redirect
      window.location.href = redirectTo;
      return { user: {} as User }; // This will be ignored due to redirect
    }
  }

  return { user: session.user };
}

/**
 * Require admin role for protected routes
 * Returns the user if admin, otherwise redirects to login or unauthorized page
 */
export async function requireAdmin(redirectTo: string = '/unauthorized'): Promise<{ user: User }> {
  const { user } = await requireAuth(redirectTo);
  
  if (user.role !== "ADMIN") {
    if (typeof window === 'undefined') {
      redirect(redirectTo);
    } else {
      window.location.href = redirectTo;
      return { user };
    }
  }

  return { user };
}

/**
 * Get the current user from the session
 * For use in React components and server components
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
    const user = await getCurrentUser();
    return user?.role === role;
  } catch (error) {
    console.error("Error checking user role:", error);
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
