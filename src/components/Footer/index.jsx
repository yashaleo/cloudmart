import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom"; // Import from react-router-dom

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#121212",
        color: "#ffffff",
        py: 4,
        mt: 4,
        borderTop: "1px solid #333",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between">
          {/* Branding Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#FFD700" }} // Gold-ish for contrast
            >
              CloudMart
            </Typography>
            <Typography variant="body2" color="gray">
              Your AI-powered shopping destination
            </Typography>
          </Grid>

          {/* Navigation Links */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{ textAlign: { xs: "center", md: "right" } }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                gap: 2,
              }}
            >
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                Home
              </Link>
              <Link
                to="/cart"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Cart
              </Link>
              <Link
                to="/my-orders"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                My Orders
              </Link>
              <Link
                to="/about"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                About
              </Link>
              <Link
                to="/customer-support"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Support
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="gray">
            © {new Date().getFullYear()} CloudMart. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
