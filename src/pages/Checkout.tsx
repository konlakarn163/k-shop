import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useCart } from "../hooks/useCart";
import { formatTHB } from "../utils/formatCurrency";
import { applyImageFallback, resolveImageSrc } from "../utils/resolveImage";

type ErrorState = {
  name?: string;
  phone?: string;
  address?: string;
  cardName?: string;
  creditCard?: string;
  expiryDate?: string;
  cvv?: string;
};

export default function Checkout() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardName, setCardName] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<ErrorState>({});

  useEffect(() => {
    document.title = "K Shop | Checkout";
  }, []);

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const isValidPhone = (phoneNumber: string) =>
    /^\d{9,15}$/.test(phoneNumber.replace(/\D/g, ""));
  const isValidCardNumber = (number: string) =>
    /^\d{13,19}$/.test(number.replace(/\s+/g, ""));
  const isValidExpiry = (expiry: string) => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry);
  const isValidCVV = (value: string) => /^\d{3,4}$/.test(value);

  const handleSubmit = () => {
    const newErrors: ErrorState = {};

    if (!name) newErrors.name = "Please enter your name";

    if (!phone) newErrors.phone = "Please enter your phone number";
    else if (!isValidPhone(phone)) newErrors.phone = "Invalid phone number";

    if (!address) newErrors.address = "Please enter your address";

    if (paymentMethod === "credit") {
      if (!cardName) newErrors.cardName = "Please enter cardholder name";

      if (!creditCard) newErrors.creditCard = "Please enter card number";
      else if (!isValidCardNumber(creditCard))
        newErrors.creditCard = "Invalid card number";

      if (!expiryDate) newErrors.expiryDate = "Please enter expiry date";
      else if (!isValidExpiry(expiryDate))
        newErrors.expiryDate = "Invalid expiry date (MM/YY)";

      if (!cvv) newErrors.cvv = "Please enter CVV";
      else if (!isValidCVV(cvv)) newErrors.cvv = "Invalid CVV";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    enqueueSnackbar(`Success: ${paymentMethod.toUpperCase()} | Total: ${formatTHB(total)}`, {
      variant: "success",
    });

    setTimeout(() => {
      clearCart();
      navigate("/payment-complete");
    }, 450);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-stone-900">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <div className="space-y-5 rounded-3xl border border-stone-200 bg-white p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Delivery Address</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-800"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-800"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div className="md:col-span-2">
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Address"
                rows={3}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-800"
              />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Payment Method</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {["cod", "bank", "promptpay", "credit"].map((method) => (
                <label
                  key={method}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-sm capitalize transition ${
                    paymentMethod === method
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 bg-white text-stone-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="hidden"
                  />
                  {method === "cod"
                    ? "Cash on Delivery"
                    : method === "bank"
                    ? "Bank Transfer"
                    : method === "promptpay"
                    ? "PromptPay"
                    : "Credit / Debit Card"}
                </label>
              ))}
            </div>
          </div>

          {paymentMethod === "bank" && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-700">
              Bank Transfer: KBank 123-4-56789-0
            </div>
          )}

          {paymentMethod === "promptpay" && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-700">
              PromptPay: 0987654321
            </div>
          )}

          {paymentMethod === "credit" && (
            <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
              <div>
                <input
                  value={cardName}
                  onChange={(event) => setCardName(event.target.value)}
                  placeholder="Cardholder Name"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-800"
                />
                {errors.cardName && <p className="mt-1 text-xs text-red-500">{errors.cardName}</p>}
              </div>

              <div>
                <input
                  value={creditCard}
                  onChange={(event) => setCreditCard(event.target.value)}
                  placeholder="Card Number"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-800"
                />
                {errors.creditCard && (
                  <p className="mt-1 text-xs text-red-500">{errors.creditCard}</p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <input
                    value={expiryDate}
                    onChange={(event) => setExpiryDate(event.target.value)}
                    placeholder="MM/YY"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-800"
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-xs text-red-500">{errors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <input
                    value={cvv}
                    onChange={(event) => setCvv(event.target.value)}
                    placeholder="CVV"
                    type="password"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-800"
                  />
                  {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-stone-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Order Summary</p>
          <ul className="mt-4 space-y-3">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src={resolveImageSrc(item.image)}
                    onError={applyImageFallback}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
                    <p className="text-xs text-stone-500">x{item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm text-stone-700">{formatTHB(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-stone-200 pt-4">
            <div className="flex items-center justify-between text-lg font-semibold text-stone-900">
              <span>Total</span>
              <span>{formatTHB(total)}</span>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 w-full rounded-full bg-stone-900 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-stone-700"
            >
              Confirm Order
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
