'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden relative" style={{
      background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
    }}>

      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold text-pink-900">GiftEm</div>
        
        <div className="flex items-center gap-8">
          <a href="#" className="text-sm text-pink-800 hover:text-pink-600 transition font-medium">Home</a>
          <a href="#" className="text-sm text-pink-800 hover:text-pink-600 transition font-medium">How It Works</a>
          <a href="#" className="text-sm text-pink-800 hover:text-pink-600 transition font-medium">About</a>
          <a href="#" className="text-sm text-pink-800 hover:text-pink-600 transition font-medium">Pricing</a>
          <a href="#" className="text-sm text-pink-800 hover:text-pink-600 transition font-medium">Contact</a>
          
          <Link href="/auth" className="bg-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-pink-600 transition inline-block">
            Start Planning
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 text-center">
        
        <h1 className="font-serif text-6xl md:text-7xl font-bold leading-tight max-w-4xl mb-6 text-pink-900">
          Never Miss The <span className="italic text-pink-600">Perfect Gift</span>
        </h1>

        <p className="mt-6 text-pink-800 text-lg md:text-xl max-w-2xl font-light">
          AI-powered gift suggestions with savings goals that unlock your special moment
        </p>

        <div className="mt-12 flex gap-4 justify-center">
          <Link href="/auth" className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition inline-block shadow-lg">
            Start Planning
          </Link>
          <button className="border-2 border-pink-600 text-pink-700 px-8 py-3 rounded-full font-semibold hover:bg-pink-100/50 transition">
            Learn More
          </button>
        </div>

      </section>
    </main>
  );
}
