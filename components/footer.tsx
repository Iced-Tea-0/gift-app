'use client'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg font-bold text-accent-primary mb-3">
              Giftem
            </h3>
            <p className="text-muted text-sm">
              AI-powered gift planning for meaningful moments
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-accent-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-accent-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-accent-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-accent-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted">
          <p>&copy; 2026 Giftem. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-accent-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-accent-primary transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
