// Mock authentication for testing
// In production, this would use a real auth provider (Better Auth, Supabase, etc)

export interface User {
  id: string;
  name: string;
  email: string;
}

// Test credentials
export const TEST_CREDENTIALS = {
  email: 'test@giftem.com',
  password: 'password123',
  name: 'Alex',
};

export function validateCredentials(email: string, password: string): User | null {
  if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
    return {
      id: '1',
      name: TEST_CREDENTIALS.name,
      email: TEST_CREDENTIALS.email,
    };
  }
  return null;
}

export function setAuthSession(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('giftem_user', JSON.stringify(user));
    localStorage.setItem('giftem_session', 'active');
  }
}

export function getAuthSession(): User | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('giftem_user');
    const session = localStorage.getItem('giftem_session');
    if (user && session) {
      return JSON.parse(user);
    }
  }
  return null;
}

export function clearAuthSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('giftem_user');
    localStorage.removeItem('giftem_session');
  }
}
