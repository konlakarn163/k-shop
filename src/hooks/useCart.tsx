import { useCallback } from "react";
import { create } from "zustand";
import { useSnackbar } from "notistack";
import type { ReactNode } from "react";

export type CartItem = {
  cartKey: string;
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  color?: string;
  colorHex?: string;
  size?: string;
};

type StoreResult = {
  ok: boolean;
  message?: string;
  variant?: "warning" | "success" | "info";
};

type CartStore = {
  cartItems: CartItem[];
  clearCart: () => void;
  addToCartStore: (item: CartItem) => StoreResult;
  updateIncreaseQuantityStore: (cartKey: string, newQty: number) => StoreResult;
  updateDecreaseQuantityStore: (cartKey: string, newQty: number) => void;
  removeFromCartStore: (cartKey: string) => StoreResult;
};

const useCartStore = create<CartStore>((set) => ({
  cartItems: [],
  clearCart: () => set({ cartItems: [] }),
  addToCartStore: (item) => {
    let result: StoreResult = { ok: true };

    set((state) => {
      const exist = state.cartItems.find((product) => product.cartKey === item.cartKey);

      if (exist) {
        const newQty = exist.quantity + item.quantity;
        if (newQty > item.stock) {
          result = {
            ok: false,
            message: "You cannot add more than the available stock.",
            variant: "warning",
          };
          return state;
        }

        return {
          cartItems: state.cartItems.map((product) =>
            product.cartKey === item.cartKey ? { ...product, quantity: newQty } : product
          ),
        };
      }

      if (item.quantity > item.stock) {
        result = {
          ok: false,
          message: "You cannot add more than the available stock.",
          variant: "warning",
        };
        return state;
      }

      return { cartItems: [...state.cartItems, item] };
    });

    return result;
  },
  updateIncreaseQuantityStore: (cartKey, newQty) => {
    let result: StoreResult = { ok: true };

    set((state) => {
      const item = state.cartItems.find((cartItem) => cartItem.cartKey === cartKey);
      if (!item) {
        return state;
      }

      if (newQty > item.stock) {
        result = {
          ok: false,
          message: "You cannot add more than the available stock.",
          variant: "warning",
        };
        return state;
      }

      return {
        cartItems: state.cartItems.map((cartItem) =>
          cartItem.cartKey === cartKey ? { ...cartItem, quantity: newQty } : cartItem
        ),
      };
    });

    return result;
  },
  updateDecreaseQuantityStore: (cartKey, newQty) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.cartKey === cartKey ? { ...item, quantity: Math.max(1, newQty) } : item
      ),
    }));
  },
  removeFromCartStore: (cartKey) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.cartKey !== cartKey),
    }));

    return {
      ok: true,
      message: "Item removed from cart.",
      variant: "info",
    };
  },
}));

export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useCart() {
  const { enqueueSnackbar } = useSnackbar();
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const addToCartStore = useCartStore((state) => state.addToCartStore);
  const updateIncreaseQuantityStore = useCartStore(
    (state) => state.updateIncreaseQuantityStore
  );
  const updateDecreaseQuantityStore = useCartStore(
    (state) => state.updateDecreaseQuantityStore
  );
  const removeFromCartStore = useCartStore((state) => state.removeFromCartStore);

  const addToCart = useCallback(
    (item: CartItem) => {
      const result = addToCartStore(item);
      if (!result.ok && result.message) {
        enqueueSnackbar(result.message, { variant: result.variant || "warning" });
      }
    },
    [addToCartStore, enqueueSnackbar]
  );

  const updateIncreaseQuantity = useCallback(
    (cartKey: string, newQty: number) => {
      const result = updateIncreaseQuantityStore(cartKey, newQty);
      if (!result.ok && result.message) {
        enqueueSnackbar(result.message, { variant: result.variant || "warning" });
      }
    },
    [updateIncreaseQuantityStore, enqueueSnackbar]
  );

  const updateDecreaseQuantity = useCallback(
    (cartKey: string, newQty: number) => {
      updateDecreaseQuantityStore(cartKey, newQty);
    },
    [updateDecreaseQuantityStore]
  );

  const removeFromCart = useCallback(
    (cartKey: string) => {
      const result = removeFromCartStore(cartKey);
      if (result.message) {
        enqueueSnackbar(result.message, { variant: result.variant || "info" });
      }
    },
    [removeFromCartStore, enqueueSnackbar]
  );

  return {
    cartItems,
    addToCart,
    updateIncreaseQuantity,
    updateDecreaseQuantity,
    removeFromCart,
    clearCart,
  };
}
