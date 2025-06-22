import { createContext, useContext, useState } from "react";
import { useSnackbar } from "notistack";
import type { ReactNode } from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateIncreaseQuantity: (productId: number, newQty: number) => void;
  updateDecreaseQuantity: (productId: number, newQty: number) => void;
  clearCart: () => void;
  removeFromCart: (productId: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const clearCart = () => setCartItems([]);
  const addToCart = (item: CartItem) => {
    let showMessage = "";
    let variant: "warning" | "success" = "success";

    setCartItems((prev) => {
      const exist = prev.find((p) => p.id === item.id);
      if (exist) {
        const newQty = exist.quantity + item.quantity;
        if (newQty > item.stock) {
          showMessage = "You cannot add more than the available stock.";
          variant = "warning";
          return prev;
        }
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: newQty } : p
        );
      } else {
        if (item.quantity > item.stock) {
          showMessage = "You cannot add more than the available stock.";
          variant = "warning";
          return prev;
        }
        return [...prev, item];
      }
    });

    if (showMessage) {
      enqueueSnackbar(showMessage, { variant });
    }
  };

  const updateIncreaseQuantity = (productId: number, newQty: number) => {
    let showMessage = "";
    let variant: "warning" | "success" = "success";

    setCartItems((prev) => {
      const item = prev.find((item) => item.id === productId);
      if (!item) return prev;

      if (newQty > item.stock) {
        showMessage = "You cannot add more than the available stock.";
        variant = "warning";
        return prev;
      }

      return prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      );
    });

    if (showMessage) {
      enqueueSnackbar(showMessage, { variant });
    }
  };

  const updateDecreaseQuantity = (productId: number, newQty: number) => {
    setCartItems((prev) => {
      const item = prev.find((item) => item.id === productId);
      if (!item) return prev;
      return prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      );
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    enqueueSnackbar("Item removed from cart.", { variant: "info" });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateIncreaseQuantity,
        updateDecreaseQuantity,
        removeFromCart,
        clearCart
      }}
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
