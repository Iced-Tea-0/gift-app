'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Recipient {
  recipientId: string;
  name: string;
  relationship: string;
  occasion: string;
  occasionDate: string;
  budget: number;
  savedGifts: any[];
}

interface User {
  name: string;
  email: string;
  userId: string;
}

export default function Dashboard() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [editedName, setEditedName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) { router.push('/auth'); return null; }
        return res.json();
      })
      .then(data => { if (data) setUser(data); });

    fetch('/api/recipients')
      .then(res => res.json())
      .then(data => {
        if (data.recipients) setRecipients(data.recipients);
      });
  }, [router]);

  const renameRecipient = async (recipientId: string) => {
  await fetch("/api/recipients", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipientId,
      name: editedName,
    }),
  });

  setRecipients(prev =>
    prev.map(r =>
      r.recipientId === recipientId
        ? { ...r, name: editedName }
        : r
    )
  );

  setEditingId("");
};


  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const deleteRecipient = async (recipientId: string) => {
  if (!confirm("Delete this recipient?")) return;

  await fetch("/api/recipients", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipientId }),
  });

  setRecipients(prev =>
    prev.filter(r => r.recipientId !== recipientId)
  );
};
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <main className="min-h-screen overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 left-1/4 text-6xl opacity-10 animate-float">✧</div>
        <div className="absolute bottom-40 right-1/4 text-7xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>✦</div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">Amoris</div>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-600 hover:text-pink-600 transition font-semibold">Home</Link>
            <Link href="/add-recipient" className="text-sm text-gray-600 hover:text-pink-600 transition font-semibold">Plan a Gift</Link>
            <button onClick={() => setShowAboutModal(true)} className="text-sm text-gray-700 hover:text-pink-600 transition font-semibold">About</button>
            <button onClick={() => setShowContactModal(true)} className="text-sm text-gray-700 hover:text-pink-600 transition font-semibold">Contact</button>
            <div className="text-sm text-gray-700 font-semibold">Welcome, {user?.name || 'User'}</div>
            <button onClick={handleLogout} className="btn-gradient text-white px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transition">
              Log Out
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 px-8 py-12 max-w-7xl mx-auto w-full mt-24">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Your Gift Plans<span className="text-pink-600">,</span>
            </h1>
            <p className="text-2xl text-gray-700 font-semibold mt-2">{user?.name || 'User'}</p>
          </div>
          <Link href="/add-recipient" className="btn-gradient text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition inline-block">
            Add New Recipient
          </Link>
        </div>

        {recipients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-gray-700 text-lg mb-8 font-semibold">No gift plans yet. Start planning your first gift!</p>
            <Link href="/add-recipient" className="btn-gradient text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition inline-block">
              Create Your First Gift Plan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipients.map((recipient) => (
              <div key={recipient.recipientId} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition">
                {recipient.savedGifts?.length > 0 && recipient.savedGifts[0].image ? (
                  <img src={recipient.savedGifts[0].image} alt={recipient.savedGifts[0].title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-5xl">
                    🎁
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
  <div className="flex items-center gap-2">
    {editingId === recipient.recipientId ? (
      <>
        <input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              renameRecipient(recipient.recipientId);
            }
          }}
          className="border rounded px-2 py-1 text-gray-900"
          autoFocus
        />

        <button
          onClick={() => renameRecipient(recipient.recipientId)}
          className="text-green-600 hover:text-green-700"
        >
          ✔
        </button>
      </>
    ) : (
      <>
        <h3 className="text-xl font-bold text-gray-900">
          {recipient.name}
        </h3>

        <button
          onClick={() => {
            setEditingId(recipient.recipientId);
            setEditedName(recipient.name);
          }}
          className="text-gray-400 hover:text-pink-600"
        >
          ✏️
        </button>

        <button
          onClick={() => deleteRecipient(recipient.recipientId)}
          className="text-red-500 hover:text-red-700"
        >
          🗑️
        </button>
      </>
    )}
  </div>

  {recipient.relationship && (
    <span className="text-xs btn-gradient text-white px-3 py-1 rounded-full font-bold">
      {recipient.relationship}
    </span>
  )}


                  </div>

                  <div className="space-y-1 mb-4">
                    {recipient.occasion && <p className="text-sm text-gray-600 font-medium">🎉 {recipient.occasion}</p>}
                    {recipient.occasionDate && <p className="text-sm text-gray-600 font-medium">📅 {getDaysUntil(recipient.occasionDate)} days away</p>}
                    <p className="text-sm text-gray-600 font-medium">💰 Budget: {recipient.budget}</p>
                    <p className="text-sm text-gray-600 font-medium">🎀 {recipient.savedGifts?.length || 0} gift{recipient.savedGifts?.length !== 1 ? 's' : ''} saved</p>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/chat/${recipient.recipientId}`}
                      className="flex-1 text-center glass-card text-gray-900 py-2 rounded-full font-bold text-sm hover:shadow-lg transition"
                    >
                      Continue Chat
                    </Link>
                    <Link
                      href={`/savings/${recipient.recipientId}`}
                      className="flex-1 text-center btn-gradient text-white py-2 rounded-full font-bold text-sm hover:shadow-lg transition"
                    >
                      View Gifts & Savings
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAboutModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-card rounded-2xl p-12 max-w-md w-full text-center relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowAboutModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
            <div className="mb-8 text-5xl">✦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Amoris</h2>
            <p className="text-gray-600 font-medium mb-4">We&apos;ve all been there — scrambling to find the perfect gift at the last minute, or worse, missing an important occasion altogether.</p>
            <p className="text-gray-600 font-medium mb-6">Amoris combines AI-powered personalization with savings planning to help you find the perfect gift for every person you love.</p>
            <div className="pt-4 border-t border-white/30">
              <p className="text-sm text-gray-700 font-semibold mb-4">Made with love by</p>
              <div className="flex justify-center gap-4">
                <a href="https://github.com/samaykandlur" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 font-semibold text-xs transition">Samay</a>
                <span className="text-gray-400">&amp;</span>
                <a href="https://github.com/JuwairiyahP" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 font-semibold text-xs transition">Juwairiyah</a>
              </div>
            </div>
            <button onClick={() => setShowAboutModal(false)} className="mt-6 btn-gradient text-white px-6 py-2 rounded-full font-bold text-sm">Got It</button>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-card rounded-2xl p-12 max-w-md w-full relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowContactModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl font-light">×</button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">We&apos;d Love to Hear From You</h2>
            <p className="text-gray-600 text-center mb-6 font-medium text-sm">Got questions or feedback?</p>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowContactModal(false); }}>
              <input type="email" placeholder="your@email.com" className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium" />
              <textarea placeholder="Your message..." rows={4} className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-medium resize-none" />
              <button type="submit" className="w-full btn-gradient text-white py-3 rounded-full font-bold text-sm hover:shadow-lg transition">Send Message</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}