import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product as ProductType, formatINR, discountPct } from "@/lib/types";
import { useCart } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Product = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
      setProduct(data as ProductType | null);
      setLoading(false);
    })();
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-16">
          <div className="glass rounded-3xl p-16 text-center">Loading product…</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-16">
          <div className="glass rounded-3xl p-16 text-center">
            <p className="text-xl font-semibold">Product not found.</p>
            <p className="text-muted-foreground mt-2">Try browsing the shop instead.</p>
            <div className="mt-6 inline-flex">
              <Button asChild>
                <Link to="/shop">Back to shop</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const off = discountPct(product.price_inr, product.mrp_inr);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="glass rounded-[2rem] overflow-hidden">
            <img src={product.image_url ?? "/placeholder.svg"} alt={product.name} className="w-full object-cover" />
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary">{product.unit}</Badge>
                {product.is_trending && <Badge>Trending</Badge>}
              </div>
              <h1 className="font-display text-4xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground max-w-xl">{product.description ?? "Fresh grocery item ready to add to your cart."}</p>
            </div>

            <div className="grid gap-4 rounded-3xl bg-muted/40 p-6 border border-border/70">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-display text-3xl font-bold">{formatINR(product.price_inr)}</p>
                </div>
                {off > 0 && (
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{off}% off</p>
                    <p className="line-through">{formatINR(product.mrp_inr ?? product.price_inr)}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Stock</span>
                <span>{product.stock_qty > 0 ? `${product.stock_qty} available` : "Out of stock"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button className="w-full sm:w-auto" onClick={handleAdd} disabled={product.stock_qty === 0}>
                Add to cart
              </Button>
              <Button variant="outline" asChild>
                <Link to="/cart">View cart</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
