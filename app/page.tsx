export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      
      <section className="flex flex-col items-center justify-center h-screen px-6 text-center">
        
        <div className="mb-6">
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-sm">
            AI Powered Gift Planning
          </p>
        </div>

        <h1 className="text-6xl md:text-8xl font-black leading-tight max-w-5xl">
          Never Miss
          <br />
          The Perfect Gift 🎁
        </h1>

        <p className="mt-8 text-zinc-400 text-lg md:text-2xl max-w-2xl">
          Personalized AI gift suggestions with savings goals,
          milestones, and smart planning.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition">
            Start Planning
          </button>

          <button className="border border-zinc-700 px-8 py-4 rounded-2xl hover:bg-zinc-900 transition">
            Learn More
          </button>
        </div>

      </section>

    </main>
  );
}