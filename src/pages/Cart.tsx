import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "../hooks/useCart";
import { formatTHB } from "../utils/formatCurrency";
import { applyImageFallback, resolveImageSrc } from "../utils/resolveImage";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateIncreaseQuantity,
    updateDecreaseQuantity,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    document.title = "K Shop | Cart";
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 flex items-center gap-3 text-3xl font-semibold text-stone-900">
        <ShoppingBag className="h-7 w-7" />
        My Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-5 py-14 text-center">
          <p className="text-stone-500">No products in the cart.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-full bg-stone-900 px-6 py-2 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-stone-700"
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={resolveImageSrc(item.image)}
                  onError={applyImageFallback}
                  alt={item.name}
                  className="h-24 w-24 rounded-xl bg-white object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-stone-900">{item.name}</p>
                  <p className="mt-1 text-sm text-stone-500">{formatTHB(item.price)} each</p>

                  <div className="mt-3 inline-flex items-center rounded-full border border-stone-300 bg-white">
                    <button
                      onClick={() => updateDecreaseQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="rounded-l-full p-2 text-stone-700 hover:bg-stone-200"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-stone-900">{item.quantity}</span>
                    <button
                      onClick={() => updateIncreaseQuantity(item.id, item.quantity + 1)}
                      className="rounded-r-full p-2 text-stone-700 hover:bg-stone-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="text-sm font-semibold text-stone-900">{formatTHB(item.price * item.quantity)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-full border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                    aria-label="remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between text-lg font-semibold text-stone-900">
              <span>Total</span>
              <span>{formatTHB(total)}</span>
            </div>
            <div className="mt-4 text-right">
              <Link
                to="/checkout"
                className="inline-flex rounded-full bg-stone-900 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-stone-700"
              >
                Check Out
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
