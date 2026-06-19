'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getAuthSession } from '@/lib/auth';

export default function AddRecipientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    occasion: '',
    date: '',
    minBudget: '',
    maxBudget: '',
    interests: '',
  });

  const relationships = ['Friend', 'Partner', 'Parent', 'Sibling', 'Colleague', 'Other'];
  const occasions = ['Birthday', 'Anniversary', 'Wedding', 'Graduation', 'Christmas', 'Other'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.relationship || !formData.occasion || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    // Here you would typically save to database
    console.log('Form submitted:', formData);
    
    // Redirect back to dashboard
    router.push('/dashboard');
  };

  // Redirect if not authenticated
  if (!getAuthSession()) {
    router.push('/auth');
    return null;
  }

  return (
    <main className="min-h-screen text-white overflow-hidden relative" style={{
      backgroundImage: 'url(/hero-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold">GiftEm</div>
        
        <div className="flex items-center gap-8">
          <div className="text-sm">Back to Planning</div>
          <Link href="/dashboard" className="bg-slate-100 text-slate-900 px-6 py-2 rounded-full text-sm font-semibold hover:bg-slate-50 transition">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Form Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 py-12">
        
        {/* Back Link */}
        <Link href="/dashboard" className="absolute top-24 left-8 text-slate-300 hover:text-white transition text-sm flex items-center gap-2">
          ← Back to Dashboard
        </Link>

        {/* Form Card */}
        <div className="w-full max-w-2xl mt-12">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            
            {/* Title */}
            <h1 className="font-serif text-5xl font-bold mb-8 text-center">Plan a New Gift</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Recipient's Name */}
              <div>
                <label htmlFor="name" className="block text-sm text-slate-200 mb-2 font-medium">Recipient&apos;s Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter their name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition"
                  required
                />
              </div>

              {/* Relationship & Occasion Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Relationship */}
                <div>
                  <label htmlFor="relationship" className="block text-sm text-slate-200 mb-2 font-medium">Your Relationship *</label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select relationship</option>
                    {relationships.map(rel => (
                      <option key={rel} value={rel} className="bg-slate-900">{rel}</option>
                    ))}
                  </select>
                </div>

                {/* Occasion */}
                <div>
                  <label htmlFor="occasion" className="block text-sm text-slate-200 mb-2 font-medium">Occasion *</label>
                  <select
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select occasion</option>
                    {occasions.map(occ => (
                      <option key={occ} value={occ} className="bg-slate-900">{occ}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Occasion Date */}
              <div>
                <label htmlFor="date" className="block text-sm text-slate-200 mb-2 font-medium">Occasion Date *</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition"
                  required
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm text-slate-200 mb-2 font-medium">Budget Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Min</div>
                    <div className="flex items-center">
                      <span className="text-slate-400 mr-2">£</span>
                      <input
                        type="number"
                        name="minBudget"
                        placeholder="0"
                        value={formData.minBudget}
                        onChange={handleChange}
                        className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Max</div>
                    <div className="flex items-center">
                      <span className="text-slate-400 mr-2">£</span>
                      <input
                        type="number"
                        name="maxBudget"
                        placeholder="500"
                        value={formData.maxBudget}
                        onChange={handleChange}
                        className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests & Personality */}
              <div>
                <label htmlFor="interests" className="block text-sm text-slate-200 mb-2 font-medium">Interests & Personality</label>
                <textarea
                  id="interests"
                  name="interests"
                  placeholder="Tell us about them — what do they love, their hobbies, style..."
                  value={formData.interests}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-slate-100 text-slate-900 py-4 rounded-lg font-semibold hover:bg-slate-50 transition mt-8"
              >
                Get Gift Suggestions
              </button>

            </form>

          </div>
        </div>

      </div>
    </main>
  );
}
