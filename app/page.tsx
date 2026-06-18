'use client';

export default function Home() {
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
          <a href="#" className="text-sm hover:text-amber-300 transition">Home</a>
          <a href="#" className="text-sm hover:text-amber-300 transition">How It Works</a>
          <a href="#" className="text-sm hover:text-amber-300 transition">About</a>
          <a href="#" className="text-sm hover:text-amber-300 transition">Pricing</a>
          <a href="#" className="text-sm hover:text-amber-300 transition">Contact</a>
          
          <button className="bg-slate-100 text-slate-900 px-6 py-2 rounded-full text-sm font-semibold hover:bg-slate-50 transition">
            Start Planning
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 text-center">
        
        <h1 className="font-serif text-6xl md:text-7xl font-bold leading-tight max-w-4xl mb-6">
          Never Miss The <span className="italic">Perfect Gift</span>
        </h1>

        <p className="mt-6 text-slate-300 text-lg md:text-xl max-w-2xl font-light">
          AI-powered gift suggestions with savings goals that unlock your special moment
        </p>

        <div className="mt-12 flex gap-4 justify-center">
          <button className="bg-slate-100 text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-50 transition">
            Start Planning
          </button>
          <button className="border border-slate-300 text-slate-200 px-8 py-3 rounded-full font-semibold hover:bg-slate-800/50 transition">
            Learn More
          </button>
        </div>

      </section>
    </main>
  );
}
