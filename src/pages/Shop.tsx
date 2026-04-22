import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Category, Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const initialCat = params.get("category") ?? "all";
  const initialTrending = params.get("trending") === "1";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [trendingOnly, setTrendingOnly] = useState(initialTrending);
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    document.title = "Shop — Frescart";
    (async () => {
      const [cats, prods] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
      ]);
      if (cats.data) setCategories(cats.data as Category[]);
      if (prods.data) setProducts(prods.data as Product[]);
      setLoading(false);
    })();
  }, []);

  // sync URL
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (selectedCat === "all") next.delete("category");
    else next.set("category", selectedCat);
    if (trendingOnly) next.set("trending", "1");
    else next.delete("trending");
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCat, trendingOnly]);

  const filtered = useMemo(() => {
    const catId = selectedCat === "all" ? null : categories.find((c) => c.slug === selectedCat)?.id ?? null;
    let list = products.filter((p) => {
      if (catId && p.category_id !== catId) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (p.price_inr < priceRange[0] || p.price_inr > priceRange[1]) return false;
      if (p.rating < minRating) return false;
      if (inStockOnly && p.stock_qty === 0) return false;
      if (trendingOnly && !p.is_trending) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price_inr - b.price_inr);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price_inr - a.price_inr);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    return list;
  }, [products, categories, selectedCat, search, priceRange, minRating, inStockOnly, trendingOnly, sort]);

  const FilterPanel = (
    <aside className="space-y-7">
      {/* Categories */}
      <div>
        <h4 className="font-display font-semibold text-sm mb-3">Category</h4>
        <div className="space-y-1">
          <CatPill active={selectedCat === "all"} onClick={() => setSelectedCat("all")}>
            All products
          </CatPill>
          {categories.map((c) => (
            <CatPill key={c.id} active={selectedCat === c.slug} onClick={() => setSelectedCat(c.slug)}>
              <span className="mr-2">{c.icon}</span>
              {c.name}
            </CatPill>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-display font-semibold text-sm mb-3">
          Price <span className="text-muted-foreground font-normal">₹{priceRange[0]} – ₹{priceRange[1]}</span>
        </h4>
        <Slider
          value={priceRange}
          min={0}
          max={1000}
          step={10}
          onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
        />
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-display font-semibold text-sm mb-3">Minimum rating</h4>
        <div className="flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                minRating === r ? "bg-primary text-primary-foreground" : "glass hover:border-primary/40"
              }`}
            >
              {r === 0 ? "Any" : `${r}★ +`}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox id="instock" checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(!!v)} />
          <Label htmlFor="instock" className="text-sm cursor-pointer">In stock only</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="trending" checked={trendingOnly} onCheckedChange={(v) => setTrendingOnly(!!v)} />
          <Label htmlFor="trending" className="text-sm cursor-pointer">🔥 Trending only</Label>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8">
        <header className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {selectedCat === "all" ? "All products" : categories.find((c) => c.slug === selectedCat)?.name ?? "Shop"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} items found</p>
        </header>

        {/* Search + sort */}
        <div className="glass rounded-2xl p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="pl-10 bg-transparent border-border/50"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-10 rounded-md bg-muted/40 border border-border/50 px-3 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low → high</option>
            <option value="price-desc">Price: high → low</option>
            <option value="rating">Top rated</option>
          </select>
          <Button variant="glass" size="sm" className="lg:hidden" onClick={() => setShowFilters((s) => !s)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>{FilterPanel}</div>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] glass rounded-2xl animate-shimmer" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center">
                <p className="text-lg font-display font-semibold">No products match your filters</p>
                <p className="text-sm text-muted-foreground mt-1">Try widening your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {filtered.map((p, i) => (
                  <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 30, 400)}ms` }}>
                    <ProductCard product={p} onAdd={addItem} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const CatPill = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? "bg-primary/15 text-primary" : "hover:bg-muted/50 text-foreground/80"
    }`}
  >
    {children}
  </button>
);

export default Shop;
