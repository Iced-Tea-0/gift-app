'use client';

import Link from 'next/link';
import { useState } from 'react';

interface SavedGift {
  id: string;
  title: string;
  price: number;
  image: string;
  url: string;
}

interface RecipientData {
  id: string;
  name: string;
  occasion: string;
  date: string;
  budget: number;
  savedGifts: SavedGift[];
  currentSavings: number;
}

export default function RecipientDetailPage({ params }: { params: { recipientId: string } }) {
  // TODO: Fetch actual recipient data from API
  const [recipient] = useState<RecipientData>({
    id: params.recipientId,
    name: 'Your Recipient',
    occasion: 'Birthday',
    date: '2026-06-15',
    budget: 150,
    savedGifts: [],
    currentSavings: 0,
  });

  const daysUntilOccasion = Math.ceil(
    (new Date(recipient.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const progress = Math.min((recipient.currentSavings / recipient.budget) * 100, 100);
  const remaining = recipient.budget - recipient.currentSavings;
  const dailyTarget = daysUntilOccasion > 0 ? Math.ceil(remaining / daysUntilOccasion) : remaining;

  // Calculate circle progress
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (progress / 100) * circumference;

  const handleRemoveGift = (giftId: string) => {
    // TODO: API call to remove gift
    console.log('[v0] Removing gift:', giftId);
  };

  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-10 text-8xl opacity-10 animate-float">✦</div>
        <div className="absolute bottom-1/4 left-1/4 text-7xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>♡</div>
      </div>

      {/* Navigation bar */}
      <nav className="sticky top-0 z-20 flex items-center justify-between px-8 py-6 border-b border-pink-200/50 glass">
        <Link href="/dashboard" className="text-gray-700 hover:text-pink-600 transition font-semibold">
          ← Back to Dashboard
        </Link>
        <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">Amoris</div>
        <Link
          href={`/chat/${recipient.id}`}
          className="btn-gradient text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-lg transition"
        >
          Continue Chat
        </Link>
      </nav>

      <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto w-full">
        {/* Header Info Chips */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="glass-card rounded-full px-6 py-3">
            <p className="text-sm text-gray-600 font-semibold">For</p>
            <p className="text-xl font-bold text-gray-900">{recipient.name}</p>
          </div>
          <div className="glass-card rounded-full px-6 py-3">
            <p className="text-sm text-gray-600 font-semibold">Occasion</p>
            <p className="text-xl font-bold text-gray-900">{recipient.occasion}</p>
          </div>
          <div className="glass-card rounded-full px-6 py-3">
            <p className="text-sm text-gray-600 font-semibold">Date</p>
            <p className="text-xl font-bold text-gray-900">{daysUntilOccasion} days left</p>
          </div>
          <div className="glass-card rounded-full px-6 py-3">
            <p className="text-sm text-gray-600 font-semibold">Budget</p>
            <p className="text-xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
              ${recipient.budget.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Saved Gifts */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Saved Gifts</h2>

            {recipient.savedGifts.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🎁</div>
                <p className="text-gray-700 font-semibold mb-6">
                  No gifts saved yet. Start chatting to find the perfect gift!
                </p>
                <Link
                  href={`/chat/${recipient.id}`}
                  className="btn-gradient text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition inline-block"
                >
                  Start Chat
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recipient.savedGifts.map((gift) => (
                  <div key={gift.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition">
                    <img
                      src={gift.image}
                      alt={gift.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
                        {gift.title}
                      </h3>
                      <p className="text-pink-600 font-bold text-lg mb-4">${gift.price.toFixed(2)}</p>
                      <div className="flex gap-2">
                        <a
                          href={gift.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 btn-gradient text-white py-2 rounded-full font-bold text-sm text-center hover:shadow-lg transition"
                        >
                          Buy Now
                        </a>
                        <button
                          onClick={() => handleRemoveGift(gift.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded-full font-bold text-sm transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Savings Progress */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Savings Progress</h2>

            <div className="glass-card rounded-2xl p-8 text-center sticky top-24">
              {/* Circular Progress */}
              <div className="flex justify-center mb-8">
                <svg width="200" height="200" className="transform -rotate-90">
                  <circle
                    cx="100"
                    cy="100"
                    r="45"
                    fill="none"
                    stroke="rgba(255, 192, 203, 0.3)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                      <stop offset="0%" stopColor="#cc498f" />
                      <stop offset="100%" stopColor="#e8a0c0" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center justify-center mt-8">
                  <p className="text-4xl font-bold text-gray-900">{Math.round(progress)}%</p>
                  <p className="text-sm text-gray-600 font-semibold mt-1">Complete</p>
                </div>
              </div>

              <div className="mt-12">
                <div className="mb-6">
                  <p className="text-gray-600 text-sm font-semibold mb-1">Amount Saved</p>
                  <p className="text-3xl font-bold text-gray-900">${recipient.currentSavings.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 font-medium mt-1">of ${recipient.budget.toFixed(2)}</p>
                </div>

                <div className="glass rounded-2xl p-4">
                  <p className="text-gray-700 font-semibold text-sm">
                    Daily target: <span className="btn-gradient bg-clip-text text-transparent">${dailyTarget}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
