'use client';

import { useState } from 'react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <main className="min-h-screen text-white overflow-hidden relative" style={{
      backgroundImage: 'url(/hero-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>

      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <a href="/" className="text-2xl font-bold hover:opacity-80 transition">GiftEm</a>
        
        <div className="flex items-center gap-8">
          <a href="#" className="text-sm hover:text-slate-300 transition">Home</a>
          <a href="#" className="text-sm hover:text-slate-300 transition">How It Works</a>
          <a href="#" className="text-sm hover:text-slate-300 transition">About</a>
          <a href="#" className="text-sm hover:text-slate-300 transition">Pricing</a>
          <a href="#" className="text-sm hover:text-slate-300 transition">Contact</a>
        </div>
      </nav>

      {/* Auth Form Container */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 py-12">
        
        {/* Glass Morphism Card */}
        <div className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          
          {/* Form Title */}
          <h1 className="font-serif text-4xl font-bold mb-2 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-300 text-center text-sm mb-8">
            {isSignUp ? 'Join us to start your gift planning journey' : 'Log in to access your account'}
          </p>

          {/* Form */}
          <form className="space-y-4">
            {/* Name Field - Sign Up Only */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm text-slate-200 mb-2">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm text-slate-200 mb-2">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm text-slate-200 mb-2">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition"
              />
            </div>

            {/* Confirm Password - Sign Up Only */}
            {isSignUp && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm text-slate-200 mb-2">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition"
                />
              </div>
            )}

            {/* Forgot Password - Login Only */}
            {!isSignUp && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-slate-300 hover:text-slate-200 transition">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-slate-100 text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-50 transition mt-6"
            >
              {isSignUp ? 'Create Account' : 'Log In'}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-8 text-center text-sm text-slate-300">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-slate-100 font-semibold hover:text-white transition"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-slate-100 font-semibold hover:text-white transition"
                >
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
