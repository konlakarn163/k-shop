import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { z } from "zod";
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

const checkoutSchema = z
  .object({
    name: z.string().trim().min(1, "Please enter your name"),
    phone: z
      .string()
      .trim()
      .min(1, "Please enter your phone number")
      .refine((value) => /^\d{9,15}$/.test(value.replace(/\D/g, "")), {
        message: "Invalid phone number",
      }),
    address: z.string().trim().min(1, "Please enter your address"),
    paymentMethod: z.enum(["cod", "bank", "promptpay", "credit"]),
    cardName: z.string().optional(),
    creditCard: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.paymentMethod !== "credit") {
      return;
    }

    if (!value.cardName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cardName"],
        message: "Please enter cardholder name",
      });
    }

    if (!value.creditCard?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["creditCard"],
        message: "Please enter card number",
      });
    } else if (!/^\d{13,19}$/.test(value.creditCard.replace(/\s+/g, ""))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["creditCard"],
        message: "Invalid card number",
      });
    }

    if (!value.expiryDate?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryDate"],
        message: "Please enter expiry date",
      });
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value.expiryDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryDate"],
        message: "Invalid expiry date (MM/YY)",
      });
    }

    if (!value.cvv?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cvv"],
        message: "Please enter CVV",
      });
    } else if (!/^\d{3,4}$/.test(value.cvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cvv"],
        message: "Invalid CVV",
      });
    }
  });

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

  const handleSubmit = () => {
    const validationResult = checkoutSchema.safeParse({
      name,
      phone,
      address,
      paymentMethod,
      cardName,
      creditCard,
      expiryDate,
      cvv,
    });

    if (!validationResult.success) {
      const newErrors: ErrorState = {};
      for (const issue of validationResult.error.issues) {
        const field = issue.path[0] as keyof ErrorState;
        if (field && !newErrors[field]) {
          newErrors[field] = issue.message;
        }
      }

      setErrors(newErrors);
      return;
    }

    setErrors({});

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
                placeholder="Full name"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-800"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="0812345678"
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
                  placeholder="Name on card"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-800"
                />
                {errors.cardName && <p className="mt-1 text-xs text-red-500">{errors.cardName}</p>}
              </div>

              <div>
                <input
                  value={creditCard}
                  onChange={(event) => setCreditCard(event.target.value)}
                  placeholder="1234 5678 9012 3456"
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
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "").slice(0, 4);

                      if (digits.length === 0) {
                        setExpiryDate("");
                        return;
                      }

                      if (digits.length === 1) {
                        const firstDigit = Number(digits[0]);
                        const formatted = firstDigit > 1 ? `0${digits}/` : digits;
                        setExpiryDate(formatted);
                        return;
                      }

                      const formatted =
                        digits.length > 2
                          ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                          : digits;
                      setExpiryDate(formatted);
                    }}
                    placeholder="MM/YY (e.g. 08/28)"
                    inputMode="numeric"
                    maxLength={5}
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
                    placeholder="123"
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
              <li key={item.cartKey} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src={resolveImageSrc(item.image)}
                    onError={applyImageFallback}
                    alt={item.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
                    <div className="flex flex-wrap items-center gap-1 mt-0.5">
                      <p className="text-xs text-stone-500">x{item.quantity}</p>
                      {item.color && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-1.5 py-px text-[10px] text-stone-500">
                          <span className="h-2 w-2 rounded-full border border-stone-300" style={{ backgroundColor: item.colorHex }} />
                          {item.color}
                        </span>
                      )}
                      {item.size && (
                        <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-1.5 py-px text-[10px] text-stone-500">
                          {item.size}
                        </span>
                      )}
                    </div>
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
