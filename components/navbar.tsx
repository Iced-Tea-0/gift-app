'use client'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="font-serif text-2xl font-bold text-accent-primary tracking-tight">
          Giftem
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#home"
            className="text-foreground hover:text-accent-primary transition-colors text-sm"
          >
            Home
          </a>
          <a
            href="#how-it-works"
            className="text-foreground hover:text-accent-primary transition-colors text-sm"
          >
            How it Works
          </a>
          <a
            href="#about"
            className="text-foreground hover:text-accent-primary transition-colors text-sm"
          >
            About
          </a>
        </div>

        {/* CTA Button */}
        <button className="btn-primary text-sm">
          Start Planning
        </button>
      </div>
    </nav>
  )
}
