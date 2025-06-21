import React from "react";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

interface Props {
  window?: () => Window;
}

function HideOnScroll(props: Props & { children: React.ReactElement }) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar(props: Props) {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/`);
    }
  };
  return (
    <React.Fragment>
      <HideOnScroll {...props}>
        <AppBar color="inherit" elevation={0}>
          <Toolbar className="flex justify-center items-center shadow">
            <div className="container flex justify-between items-center px-2">
              <Link to="/" className="text-md sm:text-lg md:text-2xl font-bold text-blue-600">
                Beta Shop
              </Link>
              <form onSubmit={handleSearch} className="flex gap-4 items-center">
                <TextField
                  placeholder="ค้นหาสินค้า..."
                  size="small"
                  variant="outlined"
                  className="w-48 sm:w-64"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Link to="/cart">
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </Link>
              </form>
            </div>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </React.Fragment>
  );
}
