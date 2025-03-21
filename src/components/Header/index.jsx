import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Drawer,
  Box,
  Paper,
} from "@mui/material";
import SideBar from "../SideBar";
import { getUser } from "../../utils/userUtils";
import { getCartItemsCount } from "../../utils/cartUtils";

const Header = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [userName, setUserName] = useState("Anonymous");
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserName(user.firstName?.trim() || "Anonymous");
    }

    const updateCartCount = () => {
      setCartItemsCount(getCartItemsCount());
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const toggleSideBar = (open) => () => setIsSideBarOpen(open);

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#0A1929", boxShadow: 3 }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left Section: Menu Button + CloudMart Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleSideBar(true)}
            >
              <Menu />
            </IconButton>

            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "#00E5FF",
                fontWeight: "bold",
                paddingLeft: "8px", // Adjusts spacing between Menu and Title
                whiteSpace: "nowrap",
              }}
            >
              CloudMart
            </Typography>
          </Box>

          {/* Right Section: Profile & Cart */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" component={Link} to="/profile">
              <AccountCircle />
              <Typography
                variant="body1"
                sx={{
                  ml: 1,
                  color: "#E0F7FA",
                  display: { xs: "none", md: "inline" },
                }}
              >
                {userName}
              </Typography>
            </IconButton>

            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={cartItemsCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={isSideBarOpen} onClose={toggleSideBar(false)}>
        <Box width={250} role="presentation">
          <SideBar isOpen={isSideBarOpen} onClose={toggleSideBar(false)} />
        </Box>
      </Drawer>

      {/* Paper Component for UI Enhancement */}
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
          mt: 1,
          backgroundColor: "#001E3C",
          color: "#E0F7FA",
        }}
      >
        <Typography variant="body1">
          Explore the best cloud products with ease!
        </Typography>
      </Paper>
    </>
  );
};

export default Header;
