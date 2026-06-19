'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Recipient {
  id: string;
  name: string;
  relationship: string;
  occasion: string;
  date: string;
  daysUntil: number;
  currentAmount: number;
  targetAmount: number;
}

export default function Dashboard() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const userName = 'Alex'; // This would come from auth/session in a real app

  const calculateProgressPercentage = (current: number, target: number) => {
    return (current / target) * 100;
  };

  const calculateDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <main
      className="min-h-screen text-white overflow-hidden relative"
      style={{
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold">GiftEm</div>

        <div className="flex items-center gap-8">
          <a href="/" className="text-sm hover:text-slate-300 transition">
            Home
          </a>
          <a href="#" className="text-sm hover:text-slate-300 transition">
            How It Works
          </a>
          <a href="#" className="text-sm hover:text-slate-300 transition">
            About
          </a>

          <div className="flex items-center gap-4 ml-8 pl-8 border-l border-slate-600">
            <span className="text-sm">{userName}</span>
            <button className="text-slate-300 text-sm hover:text-slate-200 transition">
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto w-full">
        {/* Greeting and Add Button */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold">
            Your Gift Plans, <span className="text-slate-300">{userName}</span>
          </h1>

          <button className="bg-slate-100 text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition">
            Add New Recipient
          </button>
        </div>

        {/* Recipients Grid or Empty State */}
        {recipients.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-slate-300 text-lg mb-8">
              No gift plans yet. Start planning your first gift.
            </p>
            <button className="bg-slate-100 text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition">
              Add Recipient
            </button>
          </div>
        ) : (
          // Recipients Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition"
              >
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">{recipient.name}</h3>
                  <p className="text-slate-300 text-sm">{recipient.relationship}</p>
                </div>

                {/* Occasion Info */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-slate-300 text-sm mb-2">
                    <span className="text-slate-400">Occasion:</span> {recipient.occasion}
                  </p>
                  <p className="text-slate-300 text-sm mb-2">
                    <span className="text-slate-400">Date:</span> {recipient.date}
                  </p>
                  <p className="font-semibold text-slate-100">
                    {recipient.daysUntil} days until {recipient.occasion}
                  </p>
                </div>

                {/* Savings Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-slate-300">Savings Progress</span>
                    <span className="font-semibold">
                      ${recipient.currentAmount} / ${recipient.targetAmount}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-100 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          calculateProgressPercentage(
                            recipient.currentAmount,
                            recipient.targetAmount
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* View Gifts Button */}
                <button className="w-full border border-slate-300 text-slate-200 py-2 rounded-lg font-semibold hover:bg-slate-800/50 transition">
                  View Gifts
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
