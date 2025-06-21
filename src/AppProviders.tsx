import { CartProvider } from "./hooks/useCart";

export default function AppProviders({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
