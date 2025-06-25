import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // This endpoint is called by next-auth to handle sign out
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
