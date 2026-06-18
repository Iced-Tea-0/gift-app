'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white overflow-hidden relative">
      
      {/* Starlight effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-200 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold">Lunora<span className="text-blue-400">®</span></div>
        
        <div className="flex items-center gap-8">
          <a href="#" className="text-sm hover:text-blue-300 transition">Home</a>
          <a href="#" className="text-sm hover:text-blue-300 transition">Product</a>
          <a href="#" className="text-sm hover:text-blue-300 transition">About</a>
          <a href="#" className="text-sm hover:text-blue-300 transition">Blog</a>
          <a href="#" className="text-sm hover:text-blue-300 transition">Contact</a>
          
          <button className="border border-blue-300 text-blue-300 px-6 py-2 rounded-lg text-sm hover:bg-blue-900/30 transition">
            Start Creating
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 text-center">
        
        <h1 className="text-5xl md:text-7xl font-light leading-tight max-w-4xl mb-6">
          Where <span className="font-bold">ideas bloom</span> under starlight.
        </h1>

        <p className="mt-4 text-blue-200 text-base md:text-lg max-w-2xl font-light">
          We&apos;re building tools for dreamers, dreamers, and makers. In a world of noise, we design digital space for deep, focused meaningful creation.
        </p>

        <button className="mt-12 border border-blue-300 text-blue-300 px-8 py-3 rounded-lg font-light hover:bg-blue-900/30 transition">
          Start Creating
        </button>

      </section>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </main>
  );
}
