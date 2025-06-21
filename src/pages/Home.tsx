import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import products from "../utils/mockProducts";
import { formatTHB } from "../utils/formatCurrency";
import { useSearchParams } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function HomePage() {
  const { addToCart } = useCart();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value);
  };

  // Filter + Sort
  let filteredProducts = [...products];
  if (categoryFilter !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === categoryFilter
    );
  }

  if (searchQuery) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery)
    );
  }

  if (sortOption === "priceLowHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceHighLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "category") {
    filteredProducts.sort((a, b) => a.category.localeCompare(b.category));
  }

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Banner */}
      <section className="bg-gray-100 text-center relative">
        <div className="w-full overflow-hidden">
          <img
            src="/images/banner-elec.jpg"
            alt="Banner"
            className="max-h-[490px] w-full object-cover"
          />
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Products</h2>
          <div>
            <Button variant="outlined" onClick={handleClick}>
              Filter & Sort
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <div className="px-4 py-2 w-64">
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="computer">Computer</MenuItem>
                    <MenuItem value="laptop">Laptop</MenuItem>
                    <MenuItem value="accessories">Accessories</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortOption}
                    label="Sort"
                    onChange={handleSortChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
                    <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
                    <MenuItem value="category">Category A-Z</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Menu>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, i) => (
              <Link
                to={`/product/${item.id}`}
                key={i}
                className="border-2 p-4 rounded-xl hover:shadow-lg transition block group"
              >
                <div className="bg-white h-24 md:h-36 xl:h-48 rounded-xl mb-4 overflow-hidden flex justify-center items-center">
                  <img
                    className="w-fit max-h-24 md:max-h-36 xl:max-h-48 object-contain group-hover:scale-110 transition-all duration-500"
                    src={`/images/products/${item.imageOne}`}
                    alt={`${item?.category}-${item.imageOne}`}
                  />
                </div>
                <h3 className="text-sm sm:text-md lg:text-lg font-medium mb-1 leading-1 truncate">{item?.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{item?.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-md lg:text-lg font-semibold">
                    {formatTHB(item?.price)}
                  </span>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: { xs: '0.75rem', md: '1.125rem' } }}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({
                        id: item.id,
                        name: `${item?.name}`,
                        quantity: 1,
                        price: item?.price || 0,
                        image: `${item?.imageOne}`,
                      });
                    }}
                  >
                    Add
                  </Button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-lg py-10 flex flex-col items-center justify-center gap-3">
              <SentimentDissatisfiedIcon className="!text-5xl" />
              <p>No products available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Promotion Section */}
      <section className="bg-blue-100 text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-4">Summer Sale Up to 70% Off</h2>
        <p className="text-lg mb-6">Limited time only. Hurry up!</p>
        <Link to="/">
          <Button variant="contained" size="large">
            Shop Deals
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Beta Shop</h3>
            <p>Online shoping store.</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Help</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/" className="hover:underline">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Newsletter</h4>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded mb-2 text-gray-900 bg-white"
            />
            <Button variant="contained" fullWidth>
              Subscribe
            </Button>
          </div>
        </div>
        <div className="text-center text-sm mt-8">
          © 2025 Beta Shop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
