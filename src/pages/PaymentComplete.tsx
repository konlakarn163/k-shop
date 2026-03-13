import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function PaymentComplete() {
  useEffect(() => {
    document.title = "K Shop | Payment Complete";
  }, []);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-3xl border border-stone-200 bg-white px-6 py-12 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 text-3xl font-semibold text-stone-900">Payment Successful</h1>
        <p className="mt-2 text-stone-600">Thank you for your order. Your fashion pieces are being prepared.</p>
        <p className="mt-2 text-sm text-stone-500">Order No. #123456</p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-stone-900 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-stone-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
