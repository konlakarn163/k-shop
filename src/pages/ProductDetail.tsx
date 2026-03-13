import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import products from "../utils/mockProducts";
import { useCart } from "../hooks/useCart";
import { formatTHB } from "../utils/formatCurrency";
import RecommendedProducts from "../components/RecommentProduct";
import { applyImageFallback, resolveImageSrc } from "../utils/resolveImage";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((item) => item.id === Number(id));

  const [currentImage, setCurrentImage] = useState("");
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!product) {
      return;
    }
    document.title = `K Shop | ${product.name}`;
    setCurrentImage(product.imageOne);
    setCount(1);
  }, [product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-stone-500">No products available.</p>
        <Link to="/" className="mt-5 inline-block text-sm font-medium text-stone-900 underline">
          Back to home
        </Link>
      </div>
    );
  }

  const increase = () => {
    if (count < product.quantity) {
      setCount((value) => value + 1);
    }
  };

  const decrease = () => {
    if (count > 1) {
      setCount((value) => value - 1);
    }
  };

  const handleInput = (value: string) => {
    const numeric = Number(value);
    if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= product.quantity) {
      setCount(numeric);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 rounded-3xl border border-stone-200 bg-white p-5 md:grid-cols-2 lg:p-8">
        <div>
          <img
            src={resolveImageSrc(currentImage)}
            onError={applyImageFallback}
            alt={product.name}
            className="h-[420px] w-full rounded-2xl bg-white object-cover"
          />

          <div className="mt-3 flex gap-2">
            {[product.imageOne, product.imageTwo, product.imageThree]
              .filter(Boolean)
              .map((image) => (
                <button
                  key={image}
                  onClick={() => setCurrentImage(image)}
                  className={`overflow-hidden rounded-xl border ${
                    currentImage === image ? "border-stone-900" : "border-stone-200"
                  }`}
                >
                  <img
                    src={resolveImageSrc(image)}
                    onError={applyImageFallback}
                    alt={product.name}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">{product.category}</p>
          <h1 className="text-3xl font-semibold text-stone-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-stone-900">{formatTHB(product.price)}</p>
          <p className="leading-7 text-stone-600">{product.description}</p>

          <div className="inline-flex items-center rounded-full border border-stone-300 bg-white">
            <button
              onClick={decrease}
              className="rounded-l-full p-3 text-stone-700 transition hover:bg-stone-200"
              disabled={count <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              value={count}
              onChange={(event) => handleInput(event.target.value)}
              className="w-14 bg-transparent text-center text-sm font-medium text-stone-900 outline-none"
            />
            <button
              onClick={increase}
              className="rounded-r-full p-3 text-stone-700 transition hover:bg-stone-200"
              disabled={count >= product.quantity}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-stone-500">In stock: {product.quantity}</p>

          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                quantity: count,
                price: product.price,
                image: product.imageOne,
                stock: product.quantity,
              })
            }
            className="rounded-full bg-stone-900 px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-stone-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <RecommendedProducts />
    </div>
  );
}
