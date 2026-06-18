'use client'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Ambient background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Golden glow bloom at bottom center */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl opacity-30">
          <div
            className="absolute inset-0 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(245, 166, 35, 0.3) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Floating bokeh orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(245, 166, 35, 0.4) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-40 left-20 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(74, 155, 142, 0.3) 0%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />

        {/* Subtle particles animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(30px); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Headline */}
        <h1 className="heading-lg">
          Never Miss The{' '}
          <span className="italic text-accent-primary">Perfect Gift</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          AI-powered gift suggestions with savings goals that unlock your special moment
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="btn-primary">
            Start Planning
          </button>
          <button className="btn-secondary">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
