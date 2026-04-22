import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { Category, Product } from "@/lib/types";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);

  useEffect(() => {
    document.title = "Frescart — Smart AI Grocery Delivery in 15 min";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Frescart: AI-powered grocery delivery with personalized recommendations, recipe-aware lists and 15-minute fulfillment.");

    (async () => {
      const [cats, feat, trend] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("products").select("*").eq("is_featured", true).limit(8),
        supabase.from("products").select("*").eq("is_trending", true).limit(8),
      ]);
      if (cats.data) setCategories(cats.data as Category[]);
      if (feat.data) setFeatured(feat.data as Product[]);
      if (trend.data) setTrending(trend.data as Product[]);
    })();
  }, []);

  const { addItem } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Categories */}
        <section className="container px-4 py-16">
          <SectionHeader
            title="Shop by category"
            subtitle="Everything you need, organized the smart way"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <div key={c.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <CategoryCard category={c} />
              </div>
            ))}
          </div>
        </section>

        {/* AI band */}
        <section className="container px-4 py-10">
          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-primary-glow/15 blur-3xl pointer-events-none" />
            <div className="relative grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-semibold mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  Powered by AI
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                  Tell us a recipe.<br />
                  We'll <span className="gradient-text">build the cart.</span>
                </h2>
                <p className="mt-3 text-muted-foreground max-w-lg">
                  "Pasta arrabbiata for 4." Our AI assistant reads your recipe, picks the freshest ingredients within budget, and adds them to your cart.
                </p>
              </div>
              <div className="flex md:justify-end">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/shop?ai=1">
                    <Sparkles className="h-4 w-4" />
                    Try Smart List
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trending */}
        <section className="container px-4 py-16">
          <SectionHeader
            title="Trending this week"
            subtitle="What everyone's adding to their carts"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            href="/shop?trending=1"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {trending.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <ProductCard product={p} onAdd={addItem} />
              </div>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="container px-4 py-16">
          <SectionHeader
            title="Featured for you"
            subtitle="Curated picks at unbeatable prices"
            href="/shop"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {featured.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <ProductCard product={p} onAdd={addItem} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const SectionHeader = ({
  title,
  subtitle,
  icon,
  href,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  href?: string;
}) => (
  <div className="flex items-end justify-between mb-8 gap-4">
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {href && (
      <Link
        to={href}
        className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
      >
        See all <ArrowRight className="h-4 w-4" />
      </Link>
    )}
  </div>
);

export default Index;
