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
    <main className="min-h-screen overflow-hidden relative">
      {/* Decorative floating elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-1/4 text-6xl opacity-10 animate-float">✧</div>
        <div className="absolute bottom-40 right-1/4 text-7xl opacity-10 animate-float" style={{animationDelay: '2s'}}>✦</div>
      </div>

      <nav className="sticky top-0 z-20 flex items-center justify-between px-8 py-6 border-b border-pink-200/50 glass">
        <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">GiftEm</div>
        <div className="flex items-center gap-8">
          <div className="text-sm text-gray-700 font-semibold">Welcome, {user?.name || 'User'}</div>
          <button
            onClick={handleLogout}
            className="btn-gradient text-white px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transition"
          >
            Log Out
          </button>
        </div>
      </nav>

      <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Your Gift Plans<span className="text-pink-600">,</span>
            </h1>
            <p className="text-2xl text-gray-700 font-semibold mt-2">{user?.name || 'User'}</p>
          </div>
          <Link
            href="/add-recipient"
            className="btn-gradient text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition inline-block"
          >
            Add New Recipient
          </Link>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-gray-700 text-lg mb-8 font-semibold">
              No gift plans yet. Start planning your first gift!
            </p>
            <Link
              href="/add-recipient"
              className="btn-gradient text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition inline-block"
            >
              Create Your First Gift Plan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goals.map((goal) => (
              <div
                key={goal.savingsId}
                className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition group"
              >
                {goal.giftImage && (
                  <img
                    src={goal.giftImage}
                    alt={goal.giftTitle}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900">{goal.giftTitle}</h3>
                  <div className="inline-block btn-gradient text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    {getDaysUntil(goal.occasionDate)} days left
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-700 font-semibold">Savings Progress</span>
                      <span className="font-bold text-gray-900">
                        ${goal.currentAmount} / ${goal.giftPrice}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-white/40 rounded-full overflow-hidden">
                      <div
                        className="h-full btn-gradient rounded-full transition-all duration-500"
                        style={{ width: `${getProgress(goal.currentAmount, goal.giftPrice)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-medium">
                      Save ${goal.dailyTarget}/day to reach your goal
                    </p>
                  </div>

                  <Link
                    href={`/savings/${goal.savingsId}`}
                    className="w-full block text-center btn-gradient text-white py-3 rounded-full font-bold text-sm hover:shadow-lg transition"
                  >
                    Manage Savings
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
