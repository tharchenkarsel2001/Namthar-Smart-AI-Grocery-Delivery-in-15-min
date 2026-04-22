import { Link } from "react-router-dom";
import { Heart, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, formatINR, discountPct } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  product: Product;
  onAdd?: (p: Product) => void;
  onWishlist?: (p: Product) => void;
}

const ProductCard = ({ product, onAdd, onWishlist }: Props) => {
  const off = discountPct(product.price_inr, product.mrp_inr);
  const lowStock = product.stock_qty > 0 && product.stock_qty <= product.low_stock_threshold;
  const oos = product.stock_qty === 0;

  const handleAdd = () => {
    if (oos) {
      toast.error("Out of stock");
      return;
    }
    onAdd?.(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article className="group relative glass rounded-2xl overflow-hidden hover-lift">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <img
            src={product.image_url ?? "/placeholder.svg"}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {off > 0 && (
            <Badge className="absolute top-3 left-3 bg-gradient-primary text-primary-foreground border-0 shadow-glow">
              {off}% OFF
            </Badge>
          )}
          {product.is_trending && (
            <Badge variant="secondary" className="absolute top-3 right-3 backdrop-blur-md bg-background/60">
              🔥 Trending
            </Badge>
          )}
          {oos && (
            <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
              <span className="font-display font-semibold text-destructive">Out of stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-sm leading-snug line-clamp-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.unit}</p>
          </div>
          <button
            onClick={() => {
              onWishlist?.(product);
              toast.success("Saved to wishlist");
            }}
            className="shrink-0 h-8 w-8 grid place-items-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.rating_count})</span>
          {lowStock && <span className="ml-auto text-warning text-[10px] font-semibold">Only {product.stock_qty} left</span>}
        </div>

        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="font-display font-bold text-lg leading-none">{formatINR(product.price_inr)}</div>
            {product.mrp_inr && product.mrp_inr > product.price_inr && (
              <div className="text-xs text-muted-foreground line-through mt-0.5">{formatINR(product.mrp_inr)}</div>
            )}
          </div>
          <Button
            size="sm"
            variant={oos ? "outline" : "hero"}
            onClick={handleAdd}
            disabled={oos}
            className="h-9 px-3"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
