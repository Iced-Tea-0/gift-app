'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Product {
  giftId: string;
  title: string;
  price: string;
  image: string;
  url: string;
  rating: string;
  interest?: string;
  savedAt: string;
}

interface Recipient {
  recipientId: string;
  name: string;
  relationship: string;
  occasion: string;
  occasionDate: string;
  budget: number;
  savedGifts: Product[];
}

export default function RecipientPage() {
  const { recipientId } = useParams();
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/recipients/${recipientId}`);
      const data = await res.json();
      if (data.recipient) setRecipient(data.recipient);
      setLoading(false);
    };
    if (recipientId) load();
  }, [recipientId]);

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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

  if (!recipient) return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 font-semibold">Recipient not found.</p>
    </main>
  );

  return (
    <main className="min-h-screen overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 right-10 text-7xl opacity-10 animate-float">✦</div>
        <div className="absolute bottom-1/4 left-20 text-6xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>✧</div>
      </div>

      <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-5 border-b border-pink-200/40 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-700 hover:text-pink-600 transition font-semibold">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {recipient.name}'s Gifts 🎀
          </h1>
        </div>
        <Link
          href={`/chat/${recipientId}`}
          className="btn-gradient text-white px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg transition"
        >
          Continue Chat
        </Link>
      </div>

      <div className="relative z-10 px-8 py-10 max-w-5xl mx-auto">
        {/* Recipient info chips */}
        <div className="flex flex-wrap gap-3 mb-10">
          {recipient.relationship && (
            <span className="glass-card text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
              👤 {recipient.relationship}
            </span>
          )}
          {recipient.occasion && (
            <span className="glass-card text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
              🎉 {recipient.occasion}
            </span>
          )}
          {recipient.occasionDate && (
            <span className="glass-card text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
              📅 {getDaysUntil(recipient.occasionDate)} days away
            </span>
          )}
          <span className="glass-card text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
            💰 Budget: {recipient.budget}
          </span>
        </div>

        {/* Saved gifts */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Gifts 🛍️</h2>

        {!recipient.savedGifts?.length ? (
          <div className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl">
            <div className="text-5xl mb-4">🎁</div>
            <p className="text-gray-600 font-semibold mb-4">No gifts saved yet!</p>
            <Link
              href={`/chat/${recipientId}`}
              className="btn-gradient text-white px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg transition"
            >
              Start Chatting
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipient.savedGifts.map((gift, i) => (
              <div key={gift.giftId || i} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition group">
                <img
                  src={gift.image}
                  alt={gift.title}
                  onClick={() => window.open(gift.url, '_blank')}
                  className="w-full h-40 object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
                />
                <div className="p-4">
                  {gift.interest && (
                    <span className="inline-block btn-gradient text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                      {gift.interest}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{gift.title}</h3>
                  <p className="text-pink-600 font-bold text-lg mb-1">{gift.price}</p>
                  {gift.rating && <p className="text-xs text-gray-500 mb-3">⭐ {gift.rating}</p>}
                  <button
                    onClick={() => window.open(gift.url, '_blank')}
                    className="w-full btn-gradient text-white py-2 rounded-full text-sm font-bold hover:shadow-lg transition"
                  >
                    Buy Now 🛍️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}