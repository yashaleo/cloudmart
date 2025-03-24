import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  IconButton,
  Paper,
} from "@mui/material";
import {
  getCartItems,
  getCartTotal,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../../utils/cartUtils";
import { getUser } from "../../utils/userUtils";
import api from "../../config/axiosConfig";

const CartItem = ({ item, onRemove, onUpdateQuantity }) => (
  <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      boxShadow: 3,
    }}
  >
    <CardMedia
      component="img"
      image={item.image}
      alt={item.name}
      sx={{ width: "100%", height: 160, objectFit: "cover" }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom noWrap>
        {item.name}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        ${item.price.toFixed(2)}
      </Typography>
      <Box display="flex" alignItems="center" mt={2}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </Button>
        <Box mx={1}>{item.quantity}</Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          +
        </Button>
      </Box>
      <Button
        color="error"
        startIcon={<Trash2 size={16} />}
        onClick={() => onRemove(item.id)}
        sx={{ mt: 1 }}
      >
        Remove
      </Button>
    </CardContent>
  </Card>
);

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  total,
  isLoading,
}) => {
  if (!isOpen) return null;
  return (
    <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Box className="bg-white rounded-lg p-6 max-w-sm w-full m-4">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6">Confirm Order</Typography>
          <IconButton onClick={onClose} disabled={isLoading}>
            <X size={20} />
          </IconButton>
        </Box>
        <Typography mb={2}>
          Are you sure you want to place this order?
        </Typography>
        <Typography fontWeight="bold" mb={4}>
          Total: ${total.toFixed(2)}
        </Typography>
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Order"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const totalPrice = getCartTotal();

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    setCartItems(getCartItems());
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    updateCartItemQuantity(id, quantity);
    setCartItems(getCartItems());
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = getUser();
      if (!user?.email) {
        setError("Please log in to complete your order.");
        setLoading(false);
        return;
      }

      const order = {
        userEmail: user.email,
        status: "Pending",
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: totalPrice,
        createdAt: new Date().toISOString(),
      };

      await api.post("/orders", order);
      clearCart();
      setCartItems([]);
      setOrderSuccess(true);
      setIsConfirmationOpen(false);
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {orderSuccess ? (
        <Paper sx={{ p: 3, my: 3, backgroundColor: "#E6FFEB" }}>
          <Typography variant="h6" gutterBottom color="green">
            Order Placed Successfully!
          </Typography>
          <Typography>
            This is a demo app, so no actual purchase has been made.
          </Typography>
          <Button component={Link} to="/" sx={{ mt: 2 }}>
            Continue Shopping
          </Button>
        </Paper>
      ) : cartItems.length === 0 ? (
        <Typography>
          Your cart is empty.{" "}
          <Link to="/" style={{ color: "#007FFF" }}>
            Continue shopping
          </Link>
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {cartItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <CartItem
                  item={item}
                  onRemove={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </Grid>
            ))}
          </Grid>

          <Box mt={4} textAlign="right">
            <Typography variant="h6">
              Total: ${totalPrice.toFixed(2)}
            </Typography>
            {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => setIsConfirmationOpen(true)}
              disabled={loading}
            >
              Place Order
            </Button>
          </Box>
        </>
      )}

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleCreateOrder}
        total={totalPrice}
        isLoading={loading}
      />
    </Container>
  );
};

export default CartPage;
