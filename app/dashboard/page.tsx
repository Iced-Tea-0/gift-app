'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SavingsGoal {
  savingsId: string;
  recipientId: string;
  giftTitle: string;
  giftPrice: number;
  giftImage: string;
  occasionDate: string;
  currentAmount: number;
  dailyTarget: number;
  milestones: { percent: number; unlocked: boolean }[];
}

interface User {
  name: string;
  email: string;
  userId: string;
}

export default function Dashboard() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          router.push('/auth');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setUser(data);
      });

    fetch('/api/savings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setGoals(data);
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
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
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="text-2xl font-bold">GiftEm</div>
        <div className="flex items-center gap-8">
          <div className="text-sm">Welcome, {user?.name || 'User'}</div>
          <button
            onClick={handleLogout}
            className="bg-slate-100 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-50 transition"
          >
            Log Out
          </button>
        </div>
      </nav>

      <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold">
            Your Gift Plans, <span className="text-slate-300">{user?.name || 'User'}</span>
          </h1>
          <Link
            href="/add-recipient"
            className="bg-slate-100 text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition inline-block"
          >
            Add New Recipient
          </Link>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-slate-300 text-lg mb-8">
              No gift plans yet. Start planning your first gift.
            </p>
            <Link
              href="/add-recipient"
              className="bg-slate-100 text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition inline-block"
            >
              Add Recipient
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.savingsId}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition"
              >
                {goal.giftImage && (
                  <img
                    src={goal.giftImage}
                    alt={goal.giftTitle}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-2">{goal.giftTitle}</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    {getDaysUntil(goal.occasionDate)} days until occasion
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-300">Savings Progress</span>
                      <span className="font-semibold text-sm">
                        {goal.currentAmount} / {goal.giftPrice}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${getProgress(goal.currentAmount, goal.giftPrice)}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/savings/${goal.savingsId}`}
                    className="w-full block text-center border border-slate-300 text-slate-200 py-2 rounded-lg font-semibold hover:bg-slate-800/50 transition"
                  >
                    View Savings
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}