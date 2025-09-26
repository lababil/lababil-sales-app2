import { NextResponse } from 'next/server';
import { DEFAULT_USERS } from '../../../lib/constants';
import { verifyPassword } from '../../../lib/security';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Use DEFAULT_USERS for now (in production, use database or file storage)
    const users = DEFAULT_USERS;

    const user = users.find(u => u.username === username && u.isActive);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password, or account is inactive' },
        { status: 401 }
      );
    }

    // Verify password using bcrypt
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password, or account is inactive' },
        { status: 401 }
      );
    }

    // Return user data without password
    const { password: _, ...userData } = user;

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
