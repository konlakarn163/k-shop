import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { formatTHB } from "../utils/formatCurrency";
import { useCart } from "../hooks/useCart";
import products from "../utils/mockProducts";

export default function RecommendedProducts() {
  const { addToCart } = useCart();

  const recommended = useMemo(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [products]);

  return (
    <section className="mt-12">
      <Typography variant="h6" className="mb-4 font-bold text-black !my-2">
        Recommended Products
      </Typography>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {recommended.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-3 hover:shadow transition group space-y-2"
          >
            <Link to={`/product/${item.id}`} className="space-y-1">
              <img
                src={`/images/products/${item.imageOne}`}
                alt={item.name}
                className="h-32 object-contain mx-auto mb-2 group-hover:scale-105 transition-transform"
              />
              <Typography variant="body1" className="text-sm sm:text-md lg:text-lg font-medium mb-1 leading-1 truncate">
                {item.name}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {item.category}
              </Typography>
              <Typography
                variant="subtitle2"
                className="text-sm sm:text-md lg:text-l"
              >
                {formatTHB(item.price)}
              </Typography>
            </Link>
            <Button
              onClick={() =>
                addToCart({
                  id: item.id,
                  name: item.name,
                  quantity: 1,
                  price: item.price,
                  image: item.imageOne,
                })
              }
              variant="outlined"
              size="small"
              fullWidth
              className="mt-2"
            >
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
