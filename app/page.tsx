import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function Home() {
  try {
    const session = await auth();
    return redirect(session ? '/home' : '/login');
  } catch (error) {
    console.error('Authentication error:', error);
    return redirect('/login');
  }
}
