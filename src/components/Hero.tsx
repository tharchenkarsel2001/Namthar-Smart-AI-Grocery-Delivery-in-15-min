import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* glow blobs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute top-20 -right-20 h-96 w-96 rounded-full bg-primary-glow/15 blur-3xl pointer-events-none animate-float" />

      <div className="container relative px-4 pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              AI-powered • Live in your city
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Groceries that<br />
              <span className="gradient-text">think ahead.</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Smart recommendations, recipe-aware shopping lists, and 15-minute delivery — all powered by Frescart's AI engine.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/shop">
                  Start shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/shop?ai=1">
                  <Sparkles className="h-4 w-4" />
                  Try AI assistant
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/15 grid place-items-center">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <span><span className="font-semibold">15 min</span> delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/15 grid place-items-center">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <span><span className="font-semibold">100% fresh</span> guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/15 grid place-items-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span><span className="font-semibold">AI</span> recommendations</span>
              </div>
            </div>
          </div>

          {/* Floating product showcase */}
          <div className="relative h-[420px] md:h-[500px] hidden lg:block">
            <FloatingCard
              src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400"
              label="Royal Gala"
              price="₹189"
              className="top-4 left-4 w-48 animate-float"
              style={{ animationDelay: "0s" }}
            />
            <FloatingCard
              src="https://images.unsplash.com/photo-1605027990121-cbae9e0642db?w=400"
              label="Alphonso"
              price="₹599"
              className="top-32 right-0 w-52 animate-float"
              style={{ animationDelay: "1.5s" }}
            />
            <FloatingCard
              src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400"
              label="Amul Gold"
              price="₹68"
              className="bottom-12 left-12 w-44 animate-float"
              style={{ animationDelay: "3s" }}
            />
            <FloatingCard
              src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"
              label="Baby Spinach"
              price="₹49"
              className="bottom-0 right-16 w-44 animate-float"
              style={{ animationDelay: "0.8s" }}
            />
            {/* central glow */}
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="h-32 w-32 rounded-full bg-gradient-primary blur-3xl opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FloatingCard = ({
  src,
  label,
  price,
  className,
  style,
}: {
  src: string;
  label: string;
  price: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div className={`absolute glass rounded-2xl p-3 shadow-elegant ${className}`} style={style}>
    <div className="aspect-square w-full overflow-hidden rounded-xl">
      <img src={src} alt={label} loading="lazy" className="h-full w-full object-cover" />
    </div>
    <div className="mt-2 flex justify-between items-center px-1">
      <span className="text-xs font-medium">{label}</span>
      <span className="text-xs font-bold text-primary">{price}</span>
    </div>
  </div>
);

export default Hero;
