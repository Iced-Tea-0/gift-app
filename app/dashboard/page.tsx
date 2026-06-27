'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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

interface User {
  name: string;
  email: string;
  userId: string;
}

export default function Dashboard() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get user info from API
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/auth');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const calculateProgressPercentage = (current: number, target: number) => {
    return (current / target) * 100;
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
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
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
          <Link href="/add-recipient" className="bg-slate-100 text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition inline-block">
            Add New Recipient
          </Link>
        </div>

        {recipients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="text-slate-300 text-lg mb-8">
              No gift plans yet. Start planning your first gift.
            </p>
            <Link href="/add-recipient" className="bg-slate-100 text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition inline-block">
              Add Recipient
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">{recipient.name}</h3>
                  <p className="text-slate-300 text-sm">{recipient.relationship}</p>
                </div>
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
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-slate-300">Savings Progress</span>
                    <span className="font-semibold">
                      ${recipient.currentAmount} / ${recipient.targetAmount}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-100 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(calculateProgressPercentage(recipient.currentAmount, recipient.targetAmount), 100)}%`,
                      }}
                    />
                  </div>
                </div>
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