import type { ReactNode } from "react";
import { CartProvider } from "./hooks/useCart";

type Props = {
  children: ReactNode;
};

export default function AppProviders({ children }: Props) {
  return <CartProvider>{children}</CartProvider>;
}
