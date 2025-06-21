import { useParams } from "react-router-dom";
import products from "../utils/mockProducts";
import { useCart } from "../hooks/useCart";
import Button from "@mui/material/Button";
import { formatTHB } from "../utils/formatCurrency";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useState, useEffect } from "react";
import RecommentProduct from "../components/RecommentProduct";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();
  const [currentImg, setCurrentImg] = useState("");
  if (!product) {
    return (
      <div className="col-span-full text-center text-gray-400 text-lg py-10 flex flex-col items-center justify-center gap-3">
        <SentimentDissatisfiedIcon className="!text-5xl" />
        <p>No products available.</p>
      </div>
    );
  } else {
    if (!currentImg) {
      setCurrentImg(product.imageOne);
    }
  }

  const selectShowImage = (image: string) => {
    setCurrentImg(image);
  };

  useEffect(() => {
    if (product) {
      setCurrentImg(product.imageOne); // ตั้งรูปใหม่เมื่อ product เปลี่ยน
    }
  }, [id]);
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
            {product.imageOne && (
              <img
                src={`/images/products/${product.imageOne}`}
                className={`w-20 h-20 object-contain rounded  hover:cursor-pointer ${
                  currentImg === product.imageOne
                    ? "opacity-100 border-2 border-blue-300"
                    : "opacity-70"
                }`}
                alt="Product image one"
                onClick={() => selectShowImage(product.imageOne)}
              />
            )}
            {product.imageTwo && (
              <img
                src={`/images/products/${product.imageTwo}`}
                className={`w-20 h-20 object-contain rounded  hover:cursor-pointer ${
                  currentImg === product.imageTwo
                    ? "opacity-100 border-2 border-blue-300"
                    : "opacity-70"
                }`}
                alt="Product image two"
                onClick={() => selectShowImage(product.imageTwo)}
              />
            )}
            {product.imageThree && (
              <img
                src={`/images/products/${product.imageThree}`}
                className={`w-20 h-20 object-contain rounded  hover:cursor-pointer ${
                  currentImg === product.imageThree
                    ? "opacity-100 border-2 border-blue-300"
                    : "opacity-70"
                }`}
                alt="Product image three"
                onClick={() => selectShowImage(product.imageThree)}
              />
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2 text-black">{product.name}</h2>
          <p className="text-blue-600 text-xl font-semibold mb-4">
            {formatTHB(product.price)}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              addToCart({
                ...product,
                quantity: 1,
                price: product?.price || 0,
                image: `${product?.imageOne}`,
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
