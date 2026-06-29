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
      className="min-h-screen overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
      }}
    >
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b-2 border-pink-200 bg-white/60 backdrop-blur-md">
        <div className="text-2xl font-bold text-pink-600">GiftEm</div>
        <div className="flex items-center gap-8">
          <div className="text-sm text-pink-900 font-medium">Welcome, {user?.name || 'User'}</div>
          <button
            onClick={handleLogout}
            className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-600 transition"
          >
            Log Out
          </button>
        </div>
      </nav>

      <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-pink-900">
            Your Gift Plans, <span className="text-pink-600">{user?.name || 'User'}</span>
          </h1>
          <Link
            href="/add-recipient"
            className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition inline-block shadow-lg"
          >
            Add New Recipient
          </Link>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-pink-800 text-lg mb-8">
              No gift plans yet. Start planning your first gift.
            </p>
            <Link
              href="/add-recipient"
              className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition inline-block shadow-lg"
            >
              Add Recipient
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.savingsId}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition shadow-lg border border-pink-100"
              >
                {goal.giftImage && (
                  <img
                    src={goal.giftImage}
                    alt={goal.giftTitle}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-2 text-pink-900">{goal.giftTitle}</h3>
                  <p className="text-pink-700 text-sm mb-4">
                    {getDaysUntil(goal.occasionDate)} days until occasion
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-pink-700">Savings Progress</span>
                      <span className="font-semibold text-sm text-pink-900">
                        ${goal.currentAmount} / ${goal.giftPrice}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all duration-300"
                        style={{ width: `${getProgress(goal.currentAmount, goal.giftPrice)}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/savings/${goal.savingsId}`}
                    className="w-full block text-center bg-pink-100 text-pink-700 py-2 rounded-lg font-semibold hover:bg-pink-200 transition"
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
