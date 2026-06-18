'use client'

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Create a Profile',
      description: 'Tell us about the people you care for and your gifting style',
    },
    {
      number: 2,
      title: 'Get Suggestions',
      description: 'Receive personalized AI recommendations for thoughtful gifts',
    },
    {
      number: 3,
      title: 'Start Saving',
      description: 'Set goals and watch your gift fund grow until the moment is right',
    },
  ]

  return (
    <section
      id="how-it-works"
      className="py-20 px-6 relative bg-gradient-to-b from-transparent via-background/50 to-background"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <div className="text-center mb-16">
          <h2 className="heading-md">How It Works</h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            Three simple steps to perfect gifting
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              {/* Step number */}
              <div className="mb-6 relative">
                <div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center glow-amber"
                >
                  <span className="font-serif text-2xl font-bold text-gray-900">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-muted leading-relaxed">
                {step.description}
              </p>

              {/* Connection line (hidden on mobile, visible on md+) */}
              {step.number < 3 && (
                <div
                  className="hidden md:block absolute top-24 left-1/2 translate-x-1/2 w-px h-16 bg-gradient-to-b from-accent-primary/50 to-transparent"
                  style={{
                    marginTop: '2rem',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
