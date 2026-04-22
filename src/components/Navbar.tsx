import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, Search, MapPin, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";

const Navbar = () => {
  const { pathname } = useLocation();
  const linkCls = (path: string) =>
    `text-sm font-medium transition-colors ${
      pathname === path ? "text-primary" : "text-foreground/70 hover:text-foreground"
    }`;

  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-border/40">
        <nav className="container flex h-16 items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight hidden sm:inline">
              Frescart<span className="gradient-text">.</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Deliver to <span className="text-foreground font-medium">Bangalore 560001</span>
            <span className="mx-1 text-primary">·</span>
            <span className="text-primary font-semibold">15 min</span>
          </div>

          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for fruits, milk, snacks…"
                className="pl-10 h-10 bg-muted/40 border-border/50 focus-visible:ring-primary/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Link to="/shop" className={`${linkCls("/shop")} px-3 py-2 rounded-lg hidden md:inline-block`}>
              Shop
            </Link>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/wishlist" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin" aria-label="Admin">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/cart" className="relative inline-flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground px-1.5">
                    {count}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
