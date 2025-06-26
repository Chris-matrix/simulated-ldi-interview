import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// Initialize NextAuth with the configuration
const handler = NextAuth(authConfig);

// Export the handlers for all auth routes
export async function GET(...args: any[]) {
  try {
    return await handler(...args);
  } catch (error) {
    console.error('Auth GET error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

export async function POST(...args: any[]) {
  try {
    return await handler(...args);
  } catch (error) {
    console.error('Auth POST error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}
