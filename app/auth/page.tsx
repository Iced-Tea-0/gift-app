'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Signup failed');
          setLoading(false);
          return;
        }

        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (loginRes.ok) {
          router.push('/dashboard');
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Login failed');
          setLoading(false);
          return;
        }

        router.push('/dashboard');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
    }}>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <a href="/" className="text-2xl font-bold text-pink-600 hover:opacity-80 transition">GiftEm</a>
        <div className="flex items-center gap-8">
          <a href="#" className="text-sm text-pink-800 hover:text-pink-600 transition font-medium">Home</a>
          <a href="#" className="text-sm text-pink-800 hover:text-pink-600 transition font-medium">How It Works</a>
          <a href="#" className="text-sm text-pink-800 hover:text-pink-600 transition font-medium">About</a>
          <a href="#" className="text-sm text-pink-800 hover:text-pink-600 transition font-medium">Pricing</a>
          <a href="#" className="text-sm text-pink-800 hover:text-pink-600 transition font-medium">Contact</a>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 py-12">
        <div className="w-full max-w-md bg-white border-2 border-pink-200 rounded-2xl p-8 shadow-2xl">
          
          <h1 className="font-serif text-4xl font-bold mb-2 text-center text-pink-900">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-pink-700 text-center text-sm mb-8">
            {isSignUp ? 'Join us to start your gift planning journey' : 'Log in to access your account'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm text-pink-900 font-medium mb-2">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-pink-50 border border-pink-300 rounded-lg px-4 py-3 text-pink-900 placeholder-pink-400 focus:outline-none focus:border-pink-500 transition"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm text-pink-900 font-medium mb-2">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-pink-50 border border-pink-300 rounded-lg px-4 py-3 text-pink-900 placeholder-pink-400 focus:outline-none focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-pink-900 font-medium mb-2">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-pink-50 border border-pink-300 rounded-lg px-4 py-3 text-pink-900 placeholder-pink-400 focus:outline-none focus:border-pink-500 transition"
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm text-pink-900 font-medium mb-2">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-pink-50 border border-pink-300 rounded-lg px-4 py-3 text-pink-900 placeholder-pink-400 focus:outline-none focus:border-pink-500 transition"
                />
              </div>
            )}

            {!isSignUp && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-pink-700 hover:text-pink-600 transition">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition mt-6 disabled:opacity-50 shadow-lg"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Log In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-pink-700">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button onClick={() => setIsSignUp(false)} className="text-pink-600 font-semibold hover:text-pink-700 transition">
                  Log In
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button onClick={() => setIsSignUp(true)} className="text-pink-600 font-semibold hover:text-pink-700 transition">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
