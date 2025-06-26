import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // This will clear the authentication cookie
    const response = NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL));
    
    // Clear the session cookie
    response.cookies.set({
      name: 'next-auth.session-token',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    
    // Also clear the secure variant if using HTTPS
    response.cookies.set({
      name: '__Secure-next-auth.session-token',
      value: '',
      expires: new Date(0),
      path: '/',
      secure: true,
    });

    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}

export { POST as GET };
