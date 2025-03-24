import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0A1929",
        color: "#E0F7FA",
        py: 4,
        mt: 4,
        borderTop: "2px solid #003b5c",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between">
          {/* Branding Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#00E5FF" }}
            >
              CloudMart
            </Typography>
            <Typography variant="body2" color="#90CAF9">
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
                flexWrap: "wrap",
              }}
            >
              {[
                { to: "/", label: "Home" },
                { to: "/cart", label: "Cart" },
                { to: "/my-orders", label: "My Orders" },
                { to: "/about", label: "About" },
                { to: "/customer-support", label: "Support" },
              ].map((link) => (
                <MuiLink
                  key={link.to}
                  component={Link}
                  to={link.to}
                  underline="hover"
                  sx={{ color: "#E0F7FA", fontWeight: 500 }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="#90CAF9">
            © {new Date().getFullYear()} CloudMart. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
