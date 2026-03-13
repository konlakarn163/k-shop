import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { resolveImageSrc, applyImageFallback } from "../utils/resolveImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [searchInput, setSearchInput] = useState("");
  const [openMiniCart, setOpenMiniCart] = useState(false);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchInput.trim();
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
      return;
    }
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-base font-semibold uppercase tracking-[0.25em] text-stone-900 sm:text-lg"
        >
          K Shop
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden w-full max-w-lg items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 sm:flex"
        >
          <Search className="h-4 w-4 shrink-0 text-stone-400" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search fashion pieces..."
            className="h-auto border-0 bg-transparent px-2 py-0 text-sm shadow-none outline-none ring-0 focus-visible:ring-0"
          />
        </form>

        <div
          className="relative"
          onMouseEnter={() => setOpenMiniCart(true)}
          onMouseLeave={() => setOpenMiniCart(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cart")}
            className="relative rounded-full border border-stone-300"
            aria-label="cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -right-1.5 -top-1.5 min-w-5 px-1 text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Button>

          {openMiniCart && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">Cart</p>
              {cartItems.length === 0 ? (
                <p className="text-sm text-stone-500">No products in the cart.</p>
              ) : (
                <div className="space-y-2">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl bg-white p-2">
                      <img
                        src={resolveImageSrc(item.image)}
                        onError={applyImageFallback}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-800">{item.name}</p>
                        <p className="text-xs text-stone-500">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    className="mt-2 w-full rounded-xl text-xs uppercase tracking-[0.2em]"
                    onClick={() => navigate("/cart")}
                  >
                    View More
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-stone-200 px-4 py-2 sm:hidden">
        <form
          onSubmit={handleSearch}
          className="flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5"
        >
          <Search className="h-4 w-4 shrink-0 text-stone-400" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search fashion pieces..."
            className="h-auto border-0 bg-transparent px-2 py-0 text-sm shadow-none ring-0 focus-visible:ring-0"
          />
        </form>
      </div>
    </header>
  );
}
