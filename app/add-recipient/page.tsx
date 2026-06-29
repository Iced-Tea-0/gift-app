'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AddRecipientForm() {
  const [recipientName, setRecipientName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [occasion, setOccasion] = useState('');
  const [occasionDate, setOccasionDate] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientName.trim() || !occasion.trim() || !occasionDate || !budget) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: API call to create recipient and get ID
      // For now, redirect to dashboard
      console.log('[v0] Form submitted:', { recipientName, relationship, occasion, occasionDate, budget });
      // redirect to chat page once API is ready
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Failed to create gift plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden relative flex items-center justify-center px-6 py-12">
      {/* Decorative floating elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 text-6xl opacity-10 animate-float">✦</div>
        <div className="absolute bottom-1/3 left-20 text-7xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>✧</div>
      </div>

      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-6 border-b border-pink-200/40 bg-white/50 backdrop-blur-md">
        <Link href="/dashboard" className="text-gray-700 hover:text-pink-600 transition font-semibold">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Amoris</h1>
        <div />
      </nav>

      <div className="w-full max-w-md relative z-10 pt-24">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-4xl text-center mb-4">🎀</div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Who are you gifting?
          </h1>
          
          <p className="text-gray-600 text-center mb-8 font-medium">
            We'll help you find the perfect gift and save for it 💌
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 rounded-xl text-red-700 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Recipient Name */}
            <div>
              <label className="block text-sm text-gray-900 font-bold mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g., Mum, Sarah"
                className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-sm text-gray-900 font-bold mb-2">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium appearance-none cursor-pointer"
              >
                <option>Friend</option>
                <option>Partner</option>
                <option>Parent</option>
                <option>Sibling</option>
                <option>Other</option>
              </select>
            </div>

            {/* Occasion */}
            <div>
              <label className="block text-sm text-gray-900 font-bold mb-2">
                Occasion
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g., Birthday, Anniversary"
                className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            {/* Occasion Date */}
            <div>
              <label className="block text-sm text-gray-900 font-bold mb-2">
                Occasion Date
              </label>
              <input
                type="date"
                min={getTodayDate()}
                value={occasionDate}
                onChange={(e) => setOccasionDate(e.target.value)}
                className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm text-gray-900 font-bold mb-2">
                Budget
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-900 font-bold">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full bg-white border border-pink-300 rounded-xl px-4 py-3 pl-8 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient text-white py-3 rounded-full font-bold hover:shadow-xl transition mt-6 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Start Planning →'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
