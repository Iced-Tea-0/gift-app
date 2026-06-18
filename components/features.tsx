'use client'

export default function Features() {
  const features = [
    {
      id: 1,
      title: 'AI Gift Suggestions',
      description: 'Get personalized gift recommendations tailored to every person on your list',
      icon: '✨',
    },
    {
      id: 2,
      title: 'Savings Goals',
      description: 'Set budgets and track progress toward your gift-giving milestones',
      icon: '🎯',
    },
    {
      id: 3,
      title: 'Milestone Unlocks',
      description: 'Celebrate special moments as you reach your savings and gifting goals',
      icon: '🎁',
    },
  ]

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <div className="text-center mb-16">
          <h2 className="heading-md">Everything You Need</h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            Discover how Giftem makes gift planning magical, intuitive, and rewarding
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="glass p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 group"
            >
              {/* Icon */}
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted leading-relaxed">
                {feature.description}
              </p>

              {/* Accent line on hover */}
              <div className="mt-6 h-1 w-0 bg-accent-primary group-hover:w-8 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
