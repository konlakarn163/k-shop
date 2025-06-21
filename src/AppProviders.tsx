import { CartProvider } from "./hooks/useCart";

export default function AppProviders({ children: any }) {
  return <CartProvider>{children}</CartProvider>;
}
