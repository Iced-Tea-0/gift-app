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
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
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
<<<<<<< HEAD
        <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">Amoris</div>
        <div className="flex items-center gap-8">
          <div className="text-sm text-gray-700 font-semibold">Welcome, {user?.name || 'User'}</div>
          <button
            onClick={() => setShowAboutModal(true)}
            className="text-sm text-gray-700 hover:text-pink-600 transition font-semibold"
          >
            About
          </button>
          <button
            onClick={() => setShowContactModal(true)}
            className="text-sm text-gray-700 hover:text-pink-600 transition font-semibold"
          >
            Contact
          </button>
          <button
=======
      <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">GiftEm</div>
      <div className="flex items-center gap-8">
        <Link href="/" className="text-sm text-gray-600 hover:text-pink-600 transition">Home</Link>
        <Link href="/add-recipient" className="text-sm text-gray-600 hover:text-pink-600 transition">Plan a Gift</Link>
      <div className="text-sm text-gray-700 font-semibold">Welcome, {user?.name || 'User'}</div>
      <button
>>>>>>> 1639ea5 (fix login algorithm and sticky navbar overflow issue)
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

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-card rounded-2xl p-12 max-w-md w-full text-center relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-light"
            >
              ×
            </button>
            <div className="mb-8 text-5xl">✦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Amoris</h2>
            <p className="text-gray-600 font-medium mb-4">
              We&apos;ve all been there—scrambling to find the perfect gift at the last minute, or worse, missing an important occasion altogether.
            </p>
            <p className="text-gray-600 font-medium mb-6">
              Amoris combines AI-powered personalization with savings planning to help you find the perfect gift for every person you love.
            </p>
            <div className="pt-4 border-t border-white/30">
              <p className="text-sm text-gray-700 font-semibold mb-4">Made with love by</p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com/samaykandlur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 font-semibold text-xs transition"
                >
                  Samay
                </a>
                <span className="text-gray-400">&</span>
                <a
                  href="https://github.com/JuwairiyahP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 font-semibold text-xs transition"
                >
                  Juwairiyah
                </a>
              </div>
            </div>
            <button
              onClick={() => setShowAboutModal(false)}
              className="mt-6 btn-gradient text-white px-6 py-2 rounded-full font-bold text-sm"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-card rounded-2xl p-12 max-w-md w-full relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-light"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">We&apos;d Love to Hear From You</h2>
            <p className="text-gray-600 text-center mb-6 font-medium text-sm">Got questions or feedback?</p>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              setShowContactModal(false);
            }}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium"
              />
              <textarea
                placeholder="Your message..."
                rows={4}
                className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium resize-none"
              />
              <button
                type="submit"
                className="w-full btn-gradient text-white py-3 rounded-full font-bold text-sm hover:shadow-lg transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
