import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const SideBar = ({ isOpen, onClose }) => {
  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 285,
          backgroundColor: "#1E3A8A",
          color: "white",
        },
      }}
    >
      <Box className="w-64 h-full bg-blue-900 text-white p-4 relative">
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" className="font-bold mb-4">
          Menu
        </Typography>
        <List>
          {[
            { text: "Home", path: "/" },
            { text: "Cart", path: "/cart" },
            { text: "My Orders", path: "/my-orders" },
            { text: "About Us", path: "/about" },
            { text: "Customer Support", path: "/customer-support" },
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={onClose}
                sx={{
                  color: "white",
                  borderRadius: "8px", // Ensures the button itself has rounded corners
                  "&:hover": {
                    backgroundColor: "#1E40AF",
                    borderRadius: "8px", // Rounds the hover background
                  },
                  mx: 1, // Adds margin so the rounding is visible
                }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

// ✅ Adding PropTypes for SideBar
SideBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SideBar;
