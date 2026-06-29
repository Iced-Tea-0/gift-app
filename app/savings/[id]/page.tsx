'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Milestone {
  percent: number;
  unlocked: boolean;
}

interface Gift {
  giftId: string;
  title: string;
  price: string;
  image: string;
  url: string;
  rating: string;
  interest?: string;
}

interface Recipient {
  recipientId: string;
  name: string;
  occasion: string;
  occasionDate: string;
  budget: number;
  savedGifts: Gift[];
  currentAmount?: number;
  milestones?: Milestone[];
}

export default function SavingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [adding, setAdding] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { percent: 25, unlocked: false },
    { percent: 50, unlocked: false },
    { percent: 75, unlocked: false },
    { percent: 100, unlocked: false },
  ]);
  const [newMilestone, setNewMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    fetch(`/api/recipients/${id}`)
      .then(res => {
        if (!res.ok) { router.push('/dashboard'); return null; }
        return res.json();
      })
      .then(data => {
        if (data?.recipient) {
          setRecipient(data.recipient);
          setCurrentAmount(data.recipient.currentAmount || 0);
          if (data.recipient.milestones) setMilestones(data.recipient.milestones);
        }
        setLoading(false);
      });
  }, [id, router]);

  const parsePrice = (price: string) => parseFloat(price?.replace(/[^0-9.]/g, '') || '0') || 0;
  const totalTarget = recipient?.savedGifts?.reduce((sum, g) => sum + parsePrice(g.price), 0) || 0;
  const currencySymbol = recipient?.savedGifts?.[0]?.price?.replace(/[0-9.,\s]/g, '').trim() || '$';

  const handleAddSavings = async () => {
    if (!amountToAdd || !recipient) return;
    setAdding(true);

    const amount = parseFloat(amountToAdd);
    const newTotal = currentAmount + amount;
    const newMilestones = milestones.map(m => ({
      ...m,
      unlocked: totalTarget > 0 && (newTotal / totalTarget) * 100 >= m.percent,
    }));

    const newlyUnlocked = newMilestones.find((m, i) => m.unlocked && !milestones[i].unlocked);

    await fetch(`/api/recipients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentAmount: newTotal,
        milestones: newMilestones,
      }),
    });

    setCurrentAmount(newTotal);
    setMilestones(newMilestones);
    if (newlyUnlocked) setNewMilestone(newlyUnlocked);
    setAmountToAdd('');
    setAdding(false);
  };

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </main>
  );

  if (!recipient) return null;

  const progress = totalTarget > 0 ? Math.min((currentAmount / totalTarget) * 100, 100) : 0;
  const daysLeft = Math.ceil((new Date(recipient.occasionDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const remaining = totalTarget - currentAmount;
  const dailyNeeded = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <main className="min-h-screen overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-10 text-8xl opacity-10 animate-float">✦</div>
        <div className="absolute bottom-1/4 left-1/4 text-7xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>♡</div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 border-b border-pink-200/50 glass">
        <Link href="/dashboard" className="text-gray-700 hover:text-pink-600 transition font-semibold">
          ← Back to Dashboard
        </Link>
        <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">Amoris</div>
        <Link href={`/chat/${id}`} className="btn-gradient text-white px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transition">
          Continue Chat
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12 relative z-10 mt-24">

        {/* Saved gifts row */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Gifts for {recipient.name} 🎀</h2>
          {recipient.savedGifts?.length ? (
            <>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {recipient.savedGifts.map((gift, i) => (
                  <div
                    key={gift.giftId || i}
                    onClick={() => window.open(gift.url, '_blank')}
                    className="flex-shrink-0 w-40 glass-card rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition group"
                  >
                    <img src={gift.image} alt={gift.title} className="w-full h-28 object-cover group-hover:scale-105 transition duration-300" />
                    <div className="p-2">
                      <p className="text-xs font-bold text-gray-900 line-clamp-2">{gift.title}</p>
                      <p className="text-pink-600 font-bold text-sm mt-1">{gift.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 font-bold mt-4 text-right">
                Total: <span className="text-pink-600">{currencySymbol}{totalTarget.toFixed(2)}</span>
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm font-medium">
              No gifts saved yet —{' '}
              <Link href={`/chat/${id}`} className="text-pink-600 font-semibold">start chatting!</Link>
            </p>
          )}
        </div>

        {/* Days Countdown */}
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-gray-600 text-sm mb-2 font-semibold">Your special moment is in</p>
          <p className="text-7xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">{daysLeft}</p>
          <p className="text-gray-700 text-sm mt-2 font-semibold">days</p>
        </div>

        {/* Circular Progress */}
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="flex justify-center mb-8 relative">
            <svg width="200" height="200" className="transform -rotate-90">
              <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(255, 192, 203, 0.3)" strokeWidth="8" />
              <circle
                cx="100" cy="100" r="45" fill="none"
                stroke="url(#gradient)" strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                  <stop offset="0%" stopColor="#cc498f" />
                  <stop offset="100%" stopColor="#e8a0c0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold text-gray-900">{Math.round(progress)}%</p>
              <p className="text-sm text-gray-600 font-semibold mt-1">Complete</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Amount Saved</p>
              <p className="text-3xl font-bold text-gray-900">{currencySymbol}{currentAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-600 font-medium mt-1">of {currencySymbol}{totalTarget.toFixed(2)}</p>
            </div>
            <div className="pt-6 border-t border-white/30">
              <p className="text-gray-700 font-semibold">
                Save <span className="text-pink-600 font-bold">{currencySymbol}{dailyNeeded}</span> per day to reach your goal
              </p>
            </div>
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
        {/* Milestones */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Milestones</h2>
          <div className="space-y-3">
            {milestones.map((m, i) => (
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
                    {m.unlocked ? 'Milestone unlocked! 🎉' : `Save ${currencySymbol}${Math.ceil(totalTarget * m.percent / 100)} to unlock`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>



      {newMilestone && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-card border-2 border-pink-300 px-8 py-6 rounded-2xl z-50 text-center shadow-xl">
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-bold text-gray-900">Milestone Unlocked!</p>
          <p className="text-sm text-gray-600 font-medium mt-1">You've saved {newMilestone.percent}% of your goal</p>
          <button onClick={() => setNewMilestone(null)} className="text-xs text-pink-600 mt-3 hover:text-pink-700 font-semibold transition">
            Dismiss
          </button>
        </div>
      )}
    </main>
  );
}