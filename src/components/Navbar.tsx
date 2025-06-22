import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { useCart } from "../hooks/useCart";

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

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
              <Link
                to="/"
                className="text-md sm:text-lg md:text-2xl font-bold text-blue-600"
              >
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
                <div
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                >
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    disableRestoreFocus
                    PaperProps={{ className: "p-4 w-64" }}
                  >
                    <div className="text-sm font-medium mb-4 ">CART</div>
                    {cartItems.length === 0 ? (
                      <div className="text-gray-500 text-sm">
                        No products in the cart.
                      </div>
                    ) : (
                      <div className="space-y-1 max-h-48 overflow-auto flex flex-col gap-y-2 ">
                        {cartItems.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="text-sm flex justify-between gap-1"
                          >
                            <div className="min-w-10 min-h-10   bg-white rounded-xl overflow-hidden">
                              <img
                                src={`/images/products/${item.image}`}
                                className="w-fit h-10 object-contain rounded mx-auto"
                              />
                            </div>
                            <span>
                              {item.name}
                              {item.name}
                            </span>
                            <span className="text-blue-500">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 text-right">
                      <Button
                        size="small"
                        onClick={() => {
                          setAnchorEl(null);
                          navigate("/cart");
                        }}
                        variant="contained"
                      >
                        VIEW MORE
                      </Button>
                    </div>
                  </Popover>
                </div>
              </form>
            </div>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </React.Fragment>
  );
}
