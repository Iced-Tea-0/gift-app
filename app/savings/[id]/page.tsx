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
      className="min-h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
      }}
    >
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b-2 border-pink-200 bg-white/60 backdrop-blur-md">
        <Link href="/dashboard" className="text-pink-700 hover:text-pink-900 transition font-medium">
          ← Back to Dashboard
        </Link>
        <div className="text-2xl font-bold text-pink-600">GiftEm</div>
        <div />
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          {goal.giftImage && (
            <img src={goal.giftImage} alt={goal.giftTitle} className="w-full h-48 object-cover" />
          )}
          <div className="p-6">
  <h1 className="font-serif text-2xl font-bold mb-2 line-clamp-2 text-pink-900">
    {goal.giftTitle}
  </h1>

  <a
    href={goal.giftUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-pink-600 text-sm hover:text-pink-700 underline"
  >
    View on Amazon
  </a>
</div>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
          <p className="text-pink-700 text-sm mb-2">Your special moment is in</p>
          <p className="font-serif text-6xl font-bold text-pink-500">{daysLeft}</p>
          <p className="text-pink-700 text-sm mt-2">days</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-pink-700 text-sm">Saved so far</span>
            <span className="font-bold text-lg text-pink-900">${goal.currentAmount} / ${goal.giftPrice}</span>
          </div>
          <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-pink-700 text-sm text-center">
            Save <span className="text-pink-600 font-bold">${dailyNeeded}</span> per day to reach your goal
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="font-serif text-xl font-bold mb-4 text-pink-900">Milestones</h2>
          <div className="space-y-3">
            {goal.milestones.map((m, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-3 rounded-xl border transition ${
                  m.unlocked ? 'border-pink-400 bg-pink-100' : 'border-pink-200 bg-pink-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  m.unlocked ? 'bg-pink-500 text-white' : 'bg-pink-200 text-pink-600'
                }`}>
                  {m.unlocked ? '✓' : `${m.percent}%`}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${m.unlocked ? 'text-pink-700' : 'text-pink-600'}`}>
                    {m.percent}% reached
                  </p>
                  <p className="text-xs text-pink-600">
                    {m.unlocked ? 'Milestone unlocked!' : `Save $${Math.ceil(goal.giftPrice * m.percent / 100)} to unlock`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="font-serif text-xl font-bold mb-4 text-pink-900">Log a saving</h2>
          <div className="flex gap-3">
            <input
              type="number"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              placeholder="Amount saved today"
              className="flex-1 bg-pink-50 border border-pink-200 rounded-lg px-4 py-3 text-pink-900 placeholder-pink-400 focus:outline-none focus:border-pink-400"
            />
            <button
              onClick={handleAddSavings}
              disabled={!amountToAdd || adding}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 transition"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

      </div>

      {newMilestone && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-pink-100 border-2 border-pink-400 text-pink-700 px-6 py-4 rounded-2xl z-50 text-center shadow-lg">
          <p className="font-bold">🎉 Milestone unlocked!</p>
          <p className="text-sm">You have saved {newMilestone.percent}% of your goal</p>
          <button
            onClick={() => setNewMilestone(null)}
            className="text-xs text-pink-600 mt-2 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </main>
  );
}
