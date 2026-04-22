import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    clearCart();
    toast.success("Order placed successfully!");
    navigate("/shop");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-10">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold">Checkout</h1>
              <p className="text-muted-foreground mt-1">Confirm your order and place it instantly.</p>
            </div>
            <Button asChild>
              <Link to="/cart">Back to cart</Link>
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center">
              <p className="text-xl font-semibold">Your cart is empty.</p>
              <p className="text-muted-foreground mt-2">Add items first before checking out.</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
              <section className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="glass rounded-3xl p-5 flex items-center gap-4">
                    <img
                      src={item.product.image_url ?? "/placeholder.svg"}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-3xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.quantity} × {formatINR(item.product.price_inr)}</p>
                    </div>
                    <div className="ml-auto font-semibold">{formatINR(item.quantity * item.product.price_inr)}</div>
                  </div>
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
                <Button className="w-full mt-6" onClick={handlePlaceOrder}>
                  Place order
                </Button>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
