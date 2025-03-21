import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Search } from "lucide-react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
} from "@mui/material";
import LoadingSpinner from "../LoadingSpinner";
import { addToCart } from "../../utils/cartUtils";
import api from "../../config/axiosConfig";
import AIAssistant from "../AIAssistant";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: 3,
        transition: "transform 0.3s ease",
        "&:hover": { transform: "scale(1.03)" },
        borderRadius: 2,
      }}
    >
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{
          width: "100%",
          height: "auto",
          aspectRatio: "4 / 3",
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" title={product.name} gutterBottom noWrap>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
          }}
        >
          {product.description}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          mt: "auto",
          pb: 2,
          flexWrap: "nowrap",
          minHeight: "56px",
        }}
      >
        <Typography variant="h6" sx={{ whiteSpace: "nowrap", flexShrink: 0 }}>
          ${product.price.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onAddToCart(product)}
          sx={{
            borderRadius: 2,
            padding: "6px 10px",
            minWidth: "80px",
            maxWidth: "fit-content",
            boxShadow: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

// ✅ Adding PropTypes for ProductCard
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

const CloudMartMainPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <main style={{ flexGrow: 1, padding: "2rem 0", width: "100%" }}>
        <Container maxWidth="x1">
          <Paper
            sx={{
              padding: 2,
              marginBottom: 3,
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "1200px",
              marginX: "auto",
            }}
            elevation={3}
          >
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Featured Products
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              sx={{ width: "100%", maxWidth: "400px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          {loading ? (
            <CircularProgress sx={{ display: "block", margin: "auto" }} />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : filteredProducts.length === 0 ? (
            <Typography textAlign="center" color="textSecondary">
              No products found matching your search.
            </Typography>
          ) : (
            <Grid
              container
              spacing={4}
              sx={{ justifyContent: "center", flexWrap: "wrap" }}
            >
              {filteredProducts.map((product) => (
                <Grid
                  item
                  key={product.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ minWidth: "250px" }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </main>
      <AIAssistant />
    </Container>
  );
};

export default CloudMartMainPage;
