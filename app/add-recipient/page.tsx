'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddRecipient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    relationship: '',
    occasion: '',
    occasionDate: '',
    budget: '',
  });

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const handleSubmit = async () => {
    if (!form.name || !form.occasionDate || !form.budget) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.recipientId) {
        router.push(`/chat/${data.recipientId}`);
      }
    } catch {
      console.error('Failed to create recipient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 text-7xl opacity-10 animate-float">✦</div>
        <div className="absolute bottom-1/4 left-10 text-6xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>✧</div>
      </div>

      <div className="glass-card rounded-3xl p-10 w-full max-w-lg relative z-10">
        <Link href="/dashboard" className="text-gray-500 hover:text-pink-600 transition text-sm font-semibold">
          ← Back
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Who are you gifting? 🎀</h1>
        <p className="text-gray-500 mb-8 font-medium">We'll help you find the perfect gift and save for it 💌</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Recipient's Name *</label>
            <input
              type="text"
              placeholder="e.g. Mum, Sarah, John"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Relationship</label>
            <select
              value={form.relationship}
              onChange={(e) => setForm({ ...form, relationship: e.target.value })}
              className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            >
              <option value="">Select relationship</option>
              <option value="Partner">Partner</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Sibling">Sibling</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Occasion</label>
            <input
              type="text"
              placeholder="e.g. Birthday, Anniversary, Christmas"
              value={form.occasion}
              onChange={(e) => setForm({ ...form, occasion: e.target.value })}
              className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Occasion Date *</label>
            <input
              type="date"
              min={getTodayDate()}
              value={form.occasionDate}
              onChange={(e) => setForm({ ...form, occasionDate: e.target.value })}
              className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Budget *</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.name || !form.occasionDate || !form.budget || isLoading}
          className="w-full btn-gradient text-white py-4 rounded-full font-bold text-lg hover:shadow-lg transition disabled:opacity-50 mt-8"
        >
          {isLoading ? 'Setting up...' : 'Start Planning →'}
        </button>
      </div>
    </main>
  );
}