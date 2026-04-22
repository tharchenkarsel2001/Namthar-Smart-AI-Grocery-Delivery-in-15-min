import { Link } from "react-router-dom";
import { Category } from "@/lib/types";

const CategoryCard = ({ category }: { category: Category }) => (
  <Link
    to={`/shop?category=${category.slug}`}
    className="group glass rounded-2xl p-4 md:p-5 text-center hover-lift relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-mint opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="text-4xl md:text-5xl mb-2 transition-transform group-hover:scale-110 duration-300">
        {category.icon ?? "🛒"}
      </div>
      <h3 className="font-display font-semibold text-sm md:text-base">{category.name}</h3>
      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{category.description}</p>
    </div>
  </Link>
);

export default CategoryCard;
