import { Link, useNavigate } from "react-router-dom";
import { CartItem, useCart } from "@/lib/cart";
import { formatINR } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Your cart</h1>
            <p className="text-muted-foreground mt-1">Review items you’ve added and see your total.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={clearCart} disabled={items.length === 0}>
              Clear cart
            </Button>
            <Button asChild>
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-xl font-semibold">Your cart is empty.</p>
            <p className="text-muted-foreground mt-2">Add items from the shop and they’ll appear here.</p>
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link to="/shop">Browse products</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            <section className="space-y-4">
              {items.map((item) => (
                <CartRow
                  key={item.product.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))}
            </section>

            <aside className="glass rounded-3xl p-6 border border-border/70">
              <h2 className="font-semibold text-lg">Order summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-border/70 pt-4 text-lg font-semibold flex items-center justify-between">
                  <span>Total</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
              </div>
              <Button className="w-full mt-6" onClick={() => navigate("/checkout")} disabled={items.length === 0}>
                Proceed to checkout
              </Button>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const CartRow = ({
  item,
  updateQuantity,
  removeItem,
}: {
  item: CartItem;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
}) => {
  return (
    <div className="glass rounded-3xl p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <img
          src={item.product.image_url ?? "/placeholder.svg"}
          alt={item.product.name}
          className="h-24 w-24 rounded-3xl object-cover"
        />
        <div>
          <h3 className="font-semibold">{item.product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{item.product.unit}</p>
          <p className="text-sm font-semibold mt-2">{formatINR(item.product.price_inr)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-stretch sm:items-end">
        <div className="flex items-center gap-2 rounded-full border border-border/70 bg-muted/50 px-3 py-2">
          <Button size="sm" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
            -
          </Button>
          <Input
            value={item.quantity}
            readOnly
            className="w-16 text-center bg-transparent"
          />
          <Button size="sm" variant="outline" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
            +
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formatINR(item.product.price_inr * item.quantity)}</span>
          <button
            type="button"
            onClick={() => removeItem(item.product.id)}
            className="inline-flex items-center gap-2 text-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
