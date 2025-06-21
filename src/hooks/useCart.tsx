import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: number, newQty: number) => void;
  removeFromCart: (productId: number, newQty: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const exist = prev.find((p) => p.id === item.id);
      if (exist) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      } else {
        return [...prev, item];
      }
    });
  };
  const updateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQty } : item
        )
      );
    }
  };
  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
