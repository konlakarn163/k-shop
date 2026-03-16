import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { useSnackbar } from "notistack";
import products from "../utils/mockProducts";
import { useCart } from "../hooks/useCart";
import { formatTHB } from "../utils/formatCurrency";
import RecommendedProducts from "../components/RecommentProduct";
import { applyImageFallback, resolveImageSrc } from "../utils/resolveImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ColorOption = { label: string; hex: string };

const COLOR_OPTIONS: Record<string, ColorOption[]> = {
  women: [
    { label: "Black", hex: "#1c1917" },
    { label: "Ivory", hex: "#faf6ee" },
    { label: "Dusty Pink", hex: "#e8b4b8" },
    { label: "Sage", hex: "#9caa8e" },
    { label: "Stone", hex: "#a8a29e" },
  ],
  men: [
    { label: "Black", hex: "#1c1917" },
    { label: "White", hex: "#fafaf9" },
    { label: "Navy", hex: "#1e3a5f" },
    { label: "Olive", hex: "#6b7a5b" },
    { label: "Stone", hex: "#a8a29e" },
  ],
  shoes: [
    { label: "Black", hex: "#1c1917" },
    { label: "White", hex: "#fafaf9" },
    { label: "Tan", hex: "#c4975a" },
    { label: "Burgundy", hex: "#6e2035" },
  ],
  bags: [
    { label: "Black", hex: "#1c1917" },
    { label: "Cognac", hex: "#b5651d" },
    { label: "Cream", hex: "#f5f0e8" },
    { label: "Tan", hex: "#c4975a" },
  ],
};

const SIZE_OPTIONS: Record<string, string[]> = {
  women: ["XS", "S", "M", "L", "XL", "XXL"],
  men: ["XS", "S", "M", "L", "XL", "XXL"],
  shoes: ["36", "37", "38", "39", "40", "41", "42", "43"],
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { enqueueSnackbar } = useSnackbar();
  const product = products.find((item) => item.id === Number(id));

  const [currentImage, setCurrentImage] = useState("");
  const [count, setCount] = useState(1);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const colorOptions = COLOR_OPTIONS[product?.category ?? ""] ?? [];
  const sizeOptions = SIZE_OPTIONS[product?.category ?? ""] ?? [];

  useEffect(() => {
    if (!product) {
      return;
    }
    document.title = `K Shop | ${product.name}`;
    setCurrentImage(product.imageOne);
    setCount(1);
    setSelectedColor(COLOR_OPTIONS[product.category]?.[0] ?? null);
    setSelectedSize(null);
    setSizeError(false);
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
          <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={resolveImageSrc(currentImage)}
              onError={applyImageFallback}
              alt={product.name}
              loading="eager"
              className="h-full w-full object-cover object-center"
            />
          </div>

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
                    loading="lazy"
                    className="h-20 w-16 object-cover object-center"
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

          {/* Color selector */}
          {colorOptions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                Colour
                {selectedColor && (
                  <span className="ml-2 normal-case tracking-normal text-stone-700 font-medium">
                    — {selectedColor.label}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.label}
                    title={color.label}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95",
                      selectedColor?.label === color.label
                        ? "border-stone-900 scale-110 shadow-md"
                        : "border-transparent shadow-sm hover:border-stone-300",
                      color.label === "White" || color.label === "Ivory" || color.label === "Cream"
                        ? "ring-1 ring-stone-200"
                        : "",
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {sizeOptions.length > 0 && (
            <div className="space-y-2">
              <p className={cn("text-xs uppercase tracking-[0.25em]", sizeError ? "text-red-500" : "text-stone-500")}>
                Size
                {selectedSize ? (
                  <span className="ml-2 normal-case tracking-normal text-stone-700 font-medium">
                    — {selectedSize}
                  </span>
                ) : sizeError ? (
                  <span className="ml-2 normal-case tracking-normal font-medium"> — Please select a size</span>
                ) : null}
              </p>
              <div className={cn("flex flex-wrap gap-2 rounded-xl p-1 transition-all", sizeError ? "bg-red-50 ring-1 ring-red-300" : "")}>
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={cn(
                      "min-w-[2.75rem] rounded-lg border px-3 py-1.5 text-sm transition-all hover:border-stone-900 hover:bg-stone-50 active:scale-95",
                      selectedSize === size
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-200 bg-white text-stone-700",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="inline-flex items-center rounded-full border border-stone-300 bg-white">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={decrease}
              disabled={count <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              value={count}
              onChange={(event) => handleInput(event.target.value)}
              className="h-auto w-14 border-0 bg-transparent text-center text-sm font-medium shadow-none ring-0 focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={increase}
              disabled={count >= product.quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-stone-500">In stock: {product.quantity}</p>

          <Button
            onClick={() => {
              if (sizeOptions.length > 0 && !selectedSize) {
                setSizeError(true);
                enqueueSnackbar("Please select a size before adding to cart.", { variant: "warning" });
                return;
              }
              const cartKey = `${product.id}-${selectedColor?.label ?? ""}-${selectedSize ?? ""}`;
              addToCart({
                cartKey,
                id: product.id,
                name: product.name,
                quantity: count,
                price: product.price,
                image: product.imageOne,
                stock: product.quantity,
                color: selectedColor?.label,
                colorHex: selectedColor?.hex,
                size: selectedSize ?? undefined,
              });
            }}
            className="rounded-full px-8 text-xs uppercase tracking-[0.2em]"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <RecommendedProducts />
    </div>
  );
}
