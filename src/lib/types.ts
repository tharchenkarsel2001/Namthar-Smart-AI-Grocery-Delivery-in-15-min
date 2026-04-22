export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price_inr: number;
  mrp_inr: number | null;
  unit: string;
  stock_qty: number;
  low_stock_threshold: number;
  rating: number;
  rating_count: number;
  is_trending: boolean;
  is_featured: boolean;
  is_active: boolean;
  tags: string[] | null;
};

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const discountPct = (price: number, mrp: number | null) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};
