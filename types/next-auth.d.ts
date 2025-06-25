import type { DefaultSession, DefaultUser } from "next-auth";

// Re-export the UserRole type for consistency
export type UserRole = "USER" | "ADMIN";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  /**
   * Extend the built-in user types
   */
  interface User extends DefaultUser {
    id: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in JWT types
   */
  interface JWT {
    id: string;
    role: UserRole;
  }
}
