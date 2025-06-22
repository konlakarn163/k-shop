import { useParams } from "react-router-dom";
import products from "../utils/mockProducts";
import { useCart } from "../hooks/useCart";
import Button from "@mui/material/Button";
import { formatTHB } from "../utils/formatCurrency";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useState, useEffect } from "react";
import RecommentProduct from "../components/RecommentProduct";
import { IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();

  const [currentImg, setCurrentImg] = useState("");
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (product) {
      setCurrentImg(product.imageOne);
      setCount(1); // reset count เมื่อเปลี่ยน product
      document.title = `Beta shop | ${product ? product?.name : "Product"}`;
    }
  }, [id]);

  const handleIncrease = () => {
    if (product && count < product.quantity) {
      setCount((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value >= 1 && product && value <= product.quantity) {
        setCount(value);
      }
    }
  };

  if (!product) {
    return (
      <div className="col-span-full text-center text-gray-400 text-lg py-10 flex flex-col items-center justify-center gap-3">
        <SentimentDissatisfiedIcon className="!text-5xl" />
        <p>No products available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="p-8 grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2 bg-white">
          <div>
            {currentImg && (
              <img
                src={`/images/products/${currentImg}`}
                className="w-full h-80 object-contain rounded hover:cursor-pointer"
                alt="Product Image"
              />
            )}
          </div>
          <div className="flex gap-2">
            {[product.imageOne, product.imageTwo, product.imageThree]
              .filter(Boolean)
              .map((img, idx) => (
                <img
                  key={idx}
                  src={`/images/products/${img}`}
                  className={`w-20 h-20 object-contain rounded hover:cursor-pointer ${
                    currentImg === img
                      ? "opacity-100 border-2 border-blue-300"
                      : "opacity-70"
                  }`}
                  onClick={() => setCurrentImg(img)}
                />
              ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 text-black">{product.name}</h2>
          <p className="text-blue-600 text-xl font-semibold mb-4">
            {formatTHB(product.price)}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="flex items-center gap-2 mb-4">
            <IconButton
              size="small"
              onClick={handleDecrease}
              disabled={count <= 1}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
              size="small"
              value={count}
              onChange={handleChangeInput}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                min: 1,
                max: product.quantity,
                style: { textAlign: "center", width: "40px" },
              }}
            />
            <IconButton
              size="small"
              onClick={handleIncrease}
              disabled={count >= product.quantity}
            >
              <AddIcon fontSize="small" />
            </IconButton>
            <p className="text-sm text-gray-500 ml-2">
              In stock: {product.quantity}
            </p>
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              addToCart({
                ...product,
                quantity: count,
                price: product.price,
                image: product.imageOne,
                stock: product.quantity,
              })
            }
          >
            ADD TO CART
          </Button>
        </div>
      </div>
      <div className="px-8">
        <RecommentProduct />
      </div>
    </div>
  );
}
