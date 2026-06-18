'use client'

export default function CTA() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Ambient glow background */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 blur-3xl opacity-20"
            style={{
              background:
                'radial-gradient(circle, rgba(245, 166, 35, 0.4) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="space-y-8">
          <h2 className="heading-lg">
            Your perfect gift moment is waiting
          </h2>

          <p className="text-lg text-muted max-w-2xl mx-auto">
            Start your gift planning journey today and unlock the magic of thoughtful giving
          </p>

          <div className="flex justify-center pt-4">
            <button className="btn-primary text-lg">
              Start Planning
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
