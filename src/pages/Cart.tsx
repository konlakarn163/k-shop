import { useCart } from "../hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import { IconButton, Typography, Button } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { formatTHB } from "../utils/formatCurrency";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
export default function Cart() {
  useEffect(() => {
    document.title = "Beta shop | Cart";
  }, []);
  const {
    updateIncreaseQuantity,
    updateDecreaseQuantity,
    removeFromCart,
    cartItems,
  } = useCart();
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleDecrease = (id: number, quantity: number) => {
    updateDecreaseQuantity(id, quantity - 1);
  };
  const handleIncrease = (id: number, quantity: number) => {
    updateIncreaseQuantity(id, quantity + 1);
  };
  const navigate = useNavigate();
  return (
    <div className="container mx-auto">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 flex gap-2 items-center">
          <ShoppingCartTwoToneIcon className="text-black" />
          <p className="text-black">MY CART</p>
        </h2>
        {cartItems.length === 0 ? (
          <div className="p-8 flex flex-col gap-4 justify-center items-center  rounded-lg">
            <p className="text-gray-500">No products in the cart.</p>
            <Button
              size="small"
              onClick={() => {
                navigate("/");
              }}
              variant="contained"
            >
              GO SHOPPING
            </Button>
          </div>
        ) : (
          <div>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-200 rounded-xl"
                >
                  <div className="w-28 h-20 sm:w-20  bg-white rounded-xl overflow-hidden">
                    <img
                      src={`/images/products/${item.image}`}
                      className="w-fit h-20 object-contain rounded mx-auto"
                    />
                  </div>
                  <div className="flex md:items-center flex-col md:flex-row w-full">
                    <div className="flex-1">
                      <p className="font-semibold pl-3 sm:pl-0">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1 pl-2 sm:pl-0">
                        <IconButton
                          size="small"
                          onClick={() => handleDecrease(item.id, item.quantity)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>

                        <Typography variant="body1">{item.quantity}</Typography>

                        <IconButton
                          size="small"
                          onClick={() => handleIncrease(item.id, item.quantity)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                    <div className="flex items-center justify-between ">
                      <div className="mr-4">
                        <IconButton
                          aria-label="delete"
                          onClick={() => removeFromCart(item.id)}
                          className="!text-red-400 hover:!text-red-600"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                      <div className="text-right">
                        {formatTHB(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between items-center pt-4">
              <span className="font-bold text-lg">Total Price:</span>
              <span className="text-blue-600 font-bold text-lg">
                {formatTHB(total)}
              </span>
            </div>
            <div className="mt-6 text-right">
              <Link
                to="/checkout"
                className="bg-blue-600 text-white px-6 py-3 rounded-sm hover:bg-blue-700  hover:text-white"
              >
                Check Out
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
