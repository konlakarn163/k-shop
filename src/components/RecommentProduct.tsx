import { useMemo } from "react";
import products from "../utils/mockProducts";
import { useCart } from "../hooks/useCart";
import ProductCard from "@/components/products/ProductCard";

export default function RecommendedProducts() {
  const { addToCart } = useCart();

  const recommended = useMemo(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, []);

  return (
    <section className="mt-14">
      <p className="text-xs uppercase tracking-[0.3em] text-stone-500">You may also like</p>
      <h3 className="mt-2 text-2xl font-semibold text-stone-900">Recommended</h3>

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        {recommended.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            onAddToCart={() =>
              addToCart({
                id: item.id,
                name: item.name,
                quantity: 1,
                price: item.price,
                image: item.imageOne,
                stock: item.quantity,
              })
            }
            className="group flex h-full min-h-[360px] flex-col overflow-hidden border-0 p-0 shadow-none transition"
          />
        ))}
      </div>
    </section>
  );
}
