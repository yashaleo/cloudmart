import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { Paper, Container, Box } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {" "}
        {/* Ensure BrowserRouter wraps everything */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", // Ensures full-page height
            bgcolor: "background.default",
          }}
        >
          <Header />
          <Box sx={{ flexGrow: 1 }}>
            {" "}
            {/* Expands to push footer down */}
            <Paper
              elevation={3}
              sx={{ padding: 2, bgcolor: "background.default" }}
            >
              <Container maxWidth="md">
                <App />
              </Container>
            </Paper>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
