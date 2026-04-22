import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/40 mt-24">
    <div className="container px-4 py-14">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">
              Frescart<span className="gradient-text">.</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Smart grocery delivery in 15 minutes. Powered by AI recommendations and real-time inventory.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-sm mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">All Products</Link></li>
            <li><Link to="/shop?category=fruits" className="hover:text-foreground">Fruits</Link></li>
            <li><Link to="/shop?category=vegetables" className="hover:text-foreground">Vegetables</Link></li>
            <li><Link to="/shop?category=dairy" className="hover:text-foreground">Dairy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-sm mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">About</a></li>
            <li><a href="#" className="hover:text-foreground">Careers</a></li>
            <li><a href="#" className="hover:text-foreground">Press</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-sm mb-4">Connect</h4>
          <div className="flex gap-3">
            <a href="#" className="h-9 w-9 rounded-lg glass grid place-items-center hover:text-primary transition-colors"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="h-9 w-9 rounded-lg glass grid place-items-center hover:text-primary transition-colors"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="h-9 w-9 rounded-lg glass grid place-items-center hover:text-primary transition-colors"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
        <p>© 2026 Frescart. AI-powered grocery, built with Lovable Cloud.</p>
        <p>Made with <span className="text-primary">●</span> Neon Mint</p>
      </div>
    </div>
  </footer>
);

export default Footer;
