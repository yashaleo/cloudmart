import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00bcd4",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff4081",
      contrastText: "#ffffff",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
  typography: {
    fontFamily: "Poppins, Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(135deg, rgba(0,188,212,0.3) 0%, rgba(255,64,129,0.3) 100%)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          padding: "16px",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            background:
              "linear-gradient(135deg, rgba(0,188,212,0.5) 0%, rgba(255,64,129,0.5) 100%)",
          },
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          objectFit: "cover",
          width: "100%",
          height: "auto",
          maxHeight: "250px",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        },
      },
    },
  },
});

export default theme;
