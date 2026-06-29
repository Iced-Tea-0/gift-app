'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Milestone {
  percent: number;
  unlocked: boolean;
}

interface SavingsGoal {
  savingsId: string;
  giftTitle: string;
  giftPrice: number;
  giftUrl: string;
  giftImage: string;
  occasionDate: string;
  currentAmount: number;
  dailyTarget: number;
  daysRemaining: number;
  milestones: Milestone[];
}

export default function SavingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [adding, setAdding] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    fetch(`/api/savings/${id}`)
      .then(res => {
        if (!res.ok) {
          router.push('/dashboard');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setGoal(data);
        setLoading(false);
      });
  }, [id, router]);

  const handleAddSavings = async () => {
    if (!amountToAdd || !goal) return;
    setAdding(true);

    const res = await fetch(`/api/savings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountToAdd: parseFloat(amountToAdd) }),
    });

    const data = await res.json();

    if (res.ok) {
      const newlyUnlocked = data.milestones.find(
        (m: Milestone, i: number) => m.unlocked && !goal.milestones[i].unlocked
      );
      if (newlyUnlocked) setNewMilestone(newlyUnlocked);

      setGoal(prev => prev ? {
        ...prev,
        currentAmount: data.currentAmount,
        milestones: data.milestones,
      } : null);
      setAmountToAdd('');
    }

    setAdding(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center relative">
        <div className="text-gray-600 font-semibold text-lg">Loading your gift goal...</div>
      </main>
    );
  }

  if (!goal) return null;

  const progress = Math.min((goal.currentAmount / goal.giftPrice) * 100, 100);
  const daysLeft = Math.ceil(
    (new Date(goal.occasionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const remaining = goal.giftPrice - goal.currentAmount;
  const dailyNeeded = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining;

  // Calculate circle progress
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* Decorative floating elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-10 text-8xl opacity-10 animate-float">✦</div>
        <div className="absolute bottom-1/4 left-1/4 text-7xl opacity-10 animate-float" style={{animationDelay: '2s'}}>♡</div>
      </div>

      <nav className="sticky top-0 z-20 flex items-center justify-between px-8 py-6 border-b border-pink-200/50 glass">
        <Link href="/dashboard" className="text-gray-700 hover:text-pink-600 transition font-semibold">
          ← Back to Dashboard
        </Link>
        <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">Amoris</div>
        <div />
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12 relative z-10">

        <div className="glass-card rounded-2xl overflow-hidden">
          {goal.giftImage && (
            <img src={goal.giftImage} alt={goal.giftTitle} className="w-full h-56 object-cover" />
          )}
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-3 line-clamp-2 text-gray-900">
              {goal.giftTitle}
            </h1>

            <a
              href={goal.giftUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block btn-gradient text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-lg transition"
            >
              View Gift
            </a>
          </div>
        </div>

        {/* Days Countdown */}
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-gray-600 text-sm mb-2 font-semibold">Your special moment is in</p>
          <p className="text-7xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">{daysLeft}</p>
          <p className="text-gray-700 text-sm mt-2 font-semibold">days</p>
        </div>

        {/* Circular Progress */}
        <div className="glass-card rounded-2xl p-12 text-center">
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
              <p className="text-3xl font-bold text-gray-900">${goal.currentAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-600 font-medium mt-1">of ${goal.giftPrice.toFixed(2)}</p>
            </div>
            <div className="pt-6 border-t border-white/30">
              <p className="text-gray-700 font-semibold">
                Save <span className="btn-gradient bg-clip-text text-transparent">${dailyNeeded}</span> per day to reach your goal
              </p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Milestones</h2>
          <div className="space-y-3">
            {goal.milestones.map((m, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-2xl transition ${
                  m.unlocked ? 'glass-card border border-pink-300' : 'glass-card border border-white/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  m.unlocked ? 'btn-gradient text-white text-lg' : 'glass text-pink-600'
                }`}>
                  {m.unlocked ? '✓' : `${m.percent}%`}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${m.unlocked ? 'text-pink-600' : 'text-gray-900'}`}>
                    {m.percent}% reached
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    {m.unlocked ? 'Milestone unlocked!' : `Save $${Math.ceil(goal.giftPrice * m.percent / 100)} to unlock`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Savings */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Log a Saving</h2>
          <div className="flex gap-3 flex-wrap">
            <input
              type="number"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              placeholder="Amount saved today"
              className="flex-1 min-w-fit bg-white border border-pink-300 rounded-full px-6 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-semibold"
            />
            <button
              onClick={handleAddSavings}
              disabled={!amountToAdd || adding}
              className="btn-gradient text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

      </div>

      {newMilestone && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-card border-2 border-pink-300 px-8 py-6 rounded-2xl z-50 text-center shadow-xl animate-in bounce-in duration-500">
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-bold text-gray-900">Milestone Unlocked!</p>
          <p className="text-sm text-gray-600 font-medium mt-1">You've saved {newMilestone.percent}% of your goal</p>
          <button
            onClick={() => setNewMilestone(null)}
            className="text-xs text-pink-600 mt-3 hover:text-pink-700 font-semibold transition"
          >
            Dismiss
          </button>
        </div>
      )}
    </main>
  );
}
