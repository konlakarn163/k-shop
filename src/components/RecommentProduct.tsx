import { useMemo } from "react";
import { Link } from "react-router-dom";
import products from "../utils/mockProducts";
import { useCart } from "../hooks/useCart";
import { formatTHB } from "../utils/formatCurrency";
import { applyImageFallback, resolveImageSrc } from "../utils/resolveImage";

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
          <article key={item.id} className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
            <Link to={`/product/${item.id}`}>
              <img
                src={resolveImageSrc(item.imageOne)}
                onError={applyImageFallback}
                alt={item.name}
                className="h-40 w-full rounded-xl object-cover"
              />
              <h4 className="mt-3 truncate text-sm font-semibold text-stone-900">{item.name}</h4>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{item.category}</p>
              <p className="mt-1 text-sm font-medium text-stone-900">{formatTHB(item.price)}</p>
            </Link>
            <button
              onClick={() =>
                addToCart({
                  id: item.id,
                  name: item.name,
                  quantity: 1,
                  price: item.price,
                  image: item.imageOne,
                  stock: item.quantity,
                })
              }
              className="mt-3 w-full rounded-xl border border-stone-900 px-3 py-2 text-xs uppercase tracking-[0.15em] text-stone-900 transition hover:bg-stone-900 hover:text-white"
            >
              Add to Cart
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
