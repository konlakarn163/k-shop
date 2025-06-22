import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import PaymentComplete from "../pages/PaymentComplete";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment-complete" element={<PaymentComplete />} />
      <Route
        path="*"
        element={<div className="p-8 text-center">404 Not Found</div>}
      />
    </Routes>
  );
}
