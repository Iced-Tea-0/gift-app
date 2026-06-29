'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) setIsLoggedIn(true);
      });
  }, []);

  return (
    <main className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl opacity-20 animate-float">✦</div>
        <div className="absolute bottom-32 left-1/4 text-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}>♡</div>
      </div>

      <nav className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">Amoris</div>
          
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-gray-700 hover:text-pink-600 transition font-semibold">Home</a>
            <a href="#how-it-works" className="text-sm text-gray-700 hover:text-pink-600 transition font-semibold">How It Works</a>
            <a href="#about" className="text-sm text-gray-700 hover:text-pink-600 transition font-semibold">About</a>
            <button onClick={() => setShowContactModal(true)} className="text-sm text-gray-700 hover:text-pink-600 transition font-semibold">Contact</button>
            
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-sm text-gray-700 hover:text-pink-600 transition font-semibold">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth" className="text-sm text-gray-700 hover:text-pink-600 transition font-semibold">
                Login
              </Link>
            )}

            <Link
              href={isLoggedIn ? '/dashboard' : '/auth'}
              className="btn-gradient text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-lg transition inline-block"
            >
              Start Planning
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 text-center">
        <h1 className="font-bold text-6xl md:text-7xl leading-tight max-w-4xl mb-6 text-gray-900">
          Never Miss The <span className="italic text-pink-600">Perfect Gift</span>
        </h1>
        <p className="mt-6 text-gray-600 text-lg md:text-xl max-w-2xl font-medium">
          AI-powered gift suggestions with savings goals that unlock your special moment
        </p>
        <div className="mt-12 flex gap-4 justify-center flex-wrap">
          <Link
            href={isLoggedIn ? '/dashboard' : '/auth'}
            className="btn-gradient text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition inline-block"
          >
            Start Planning
          </Link>
          <a href="#how-it-works" className="border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-pink-50 transition">
            Learn More
          </a>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: 1, title: "Tell Us About Your Person", desc: "Chat with our AI to describe the gift recipient's interests and preferences" },
            { step: 2, title: "Get Smart Suggestions", desc: "Receive curated gift recommendations tailored to their personality" },
            { step: 3, title: "Save Together", desc: "Set savings goals and track your progress toward the perfect gift" }
          ].map((item) => (
            <div key={item.step} className="glass-card rounded-2xl p-8 text-center hover:shadow-lg transition">
              <div className="btn-gradient text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-lg">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="relative z-10 px-8 py-20 max-w-6xl mx-auto">
        <div className="glass-card rounded-3xl p-12 md:p-16 text-center">
          <div className="mb-8 text-4xl">✦</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">The Story Behind Amoris</h2>
          <p className="text-gray-700 text-lg font-medium max-w-3xl mx-auto mb-12">
            We&apos;ve all been there — scrambling to find the perfect gift at the last minute, or worse, missing an important occasion altogether. Amoris was born from a simple belief: that every gift should be meaningful, and giving it should be effortless.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="glass rounded-2xl p-8 hover:shadow-lg transition">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">💝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Samay Kandlur</h3>
              <p className="text-gray-600 font-semibold mb-3">Co-Founder</p>
              <div className="flex gap-3 justify-center">
                <a href="https://github.com/samaykandlur" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition">GitHub</a>
                <span className="text-gray-400">•</span>
                <a href="https://www.linkedin.com/in/samay-shailesh-kandlur/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition">LinkedIn</a>
              </div>
            </div>
            <div className="glass rounded-2xl p-8 hover:shadow-lg transition">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">🎀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Juwairiyah Shariff</h3>
              <p className="text-gray-600 font-semibold mb-3">Co-Founder</p>
              <div className="flex gap-3 justify-center">
                <a href="https://github.com/JuwairiyahP" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition">GitHub</a>
                <span className="text-gray-400">•</span>
                <a href="https://www.linkedin.com/in/juwairiyah-shariff-913582386/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="mt-12 text-3xl">✧</div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-pink-200 bg-white/40 backdrop-blur-sm px-8 py-12 mt-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-gray-700 font-semibold">© 2026 Amoris. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="text-gray-600 hover:text-pink-600 transition">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition">Terms</a>
            <button onClick={() => setShowContactModal(true)} className="text-gray-600 hover:text-pink-600 transition">Contact</button>
          </div>
        </div>
      </footer>

      {showAboutModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-card rounded-2xl p-12 max-w-md w-full text-center relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowAboutModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Amoris</h2>
            <p className="text-gray-600 font-medium mb-6">
              We believe every gift tells a story. Amoris combines AI-powered personalization with savings planning to help you find the perfect gift for every person you love.
            </p>
            <button onClick={() => setShowAboutModal(false)} className="btn-gradient text-white px-6 py-2 rounded-full font-bold text-sm">Got It</button>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-card rounded-2xl p-12 max-w-md w-full relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowContactModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">We&apos;d Love to Hear From You</h2>
            <p className="text-gray-600 text-center mb-6 font-medium text-sm">Got questions or feedback?</p>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowContactModal(false); }}>
              <input type="email" placeholder="your@email.com" className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium" />
              <textarea placeholder="Your message..." rows={4} className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium resize-none" />
              <button type="submit" className="w-full btn-gradient text-white py-3 rounded-full font-bold text-sm hover:shadow-lg transition">Send Message</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}