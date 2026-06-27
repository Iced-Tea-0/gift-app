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
      <main
        className="min-h-screen text-white flex items-center justify-center"
        style={{ backgroundImage: 'url(/hero-bg.png)', backgroundSize: 'cover' }}
      >
        <div className="text-slate-300">Loading...</div>
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

  return (
    <main
      className="min-h-screen text-white overflow-hidden"
      style={{
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <Link href="/dashboard" className="text-slate-300 hover:text-white transition">
          Back to Dashboard
        </Link>
        <div className="text-2xl font-bold">GiftEm</div>
        <div />
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
          {goal.giftImage && (
            <img src={goal.giftImage} alt={goal.giftTitle} className="w-full h-48 object-cover" />
          )}
          <div className="p-6">
  <h1 className="font-serif text-2xl font-bold mb-2 line-clamp-2">
    {goal.giftTitle}
  </h1>

  <a
    href={goal.giftUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-amber-400 text-sm hover:underline"
  >
    View on Amazon
  </a>
</div>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
          <p className="text-slate-300 text-sm mb-2">Your special moment is in</p>
          <p className="font-serif text-6xl font-bold text-amber-400">{daysLeft}</p>
          <p className="text-slate-300 text-sm mt-2">days</p>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-300 text-sm">Saved so far</span>
            <span className="font-bold text-lg">{goal.currentAmount} / {goal.giftPrice}</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-slate-300 text-sm text-center">
            Save <span className="text-amber-400 font-bold">{dailyNeeded}</span> per day to reach your goal
          </p>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold mb-4">Milestones</h2>
          <div className="space-y-3">
            {goal.milestones.map((m, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-3 rounded-xl border transition ${
                  m.unlocked ? 'border-amber-400/40 bg-amber-500/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  m.unlocked ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-slate-400'
                }`}>
                  {m.unlocked ? '✓' : `${m.percent}%`}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${m.unlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                    {m.percent}% reached
                  </p>
                  <p className="text-xs text-slate-400">
                    {m.unlocked ? 'Milestone unlocked!' : `Save ${Math.ceil(goal.giftPrice * m.percent / 100)} to unlock`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold mb-4">Log a saving</h2>
          <div className="flex gap-3">
            <input
              type="number"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              placeholder="Amount saved today"
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/40"
            />
            <button
              onClick={handleAddSavings}
              disabled={!amountToAdd || adding}
              className="bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 disabled:opacity-50 transition"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

      </div>

      {newMilestone && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-6 py-4 rounded-2xl z-50 text-center">
          <p className="font-bold">Milestone unlocked!</p>
          <p className="text-sm">You have saved {newMilestone.percent}% of your goal</p>
          <button
            onClick={() => setNewMilestone(null)}
            className="text-xs text-amber-400 mt-2 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </main>
  );
}