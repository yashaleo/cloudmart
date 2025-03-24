import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import api from "../../config/axiosConfig";
import { getUser } from "../../utils/userUtils";

const OrderStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning.main";
      case "Processing":
        return "info.main";
      case "Shipped":
        return "success.main";
      case "Delivered":
        return "text.secondary";
      case "Canceled":
        return "error.main";
      default:
        return "text.secondary";
    }
  };

  return (
    <Typography
      variant="body2"
      sx={{ color: getStatusColor(status), fontWeight: "bold" }}
    >
      {status}
    </Typography>
  );
};

// ✅ Adding PropTypes for OrderStatus
OrderStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

const OrderDetails = ({ order }) => (
  <Paper
    elevation={3}
    sx={{
      mt: 2,
      p: 3,
      borderRadius: 2,
      bgcolor: "rgba(255, 255, 255, 0.6)", // semi-transparent background
      backdropFilter: "blur(6px)", // subtle glass effect
      color: "#0A1929", // dark blue for better contrast
    }}
  >
    <Typography variant="h6" gutterBottom>
      Order Items:
    </Typography>
    <ul>
      {order.items.map((item, index) => (
        <li key={index}>
          {item.name} - Quantity: {item.quantity} - ${item.price.toFixed(2)}
        </li>
      ))}
    </ul>
    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
      Total: ${order.total.toFixed(2)}
    </Typography>
  </Paper>
);

// ✅ Adding PropTypes for OrderDetails
OrderDetails.propTypes = {
  order: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      }),
    ).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = getUser();
        const response = await api.get(`/orders/user?email=${user.email}`);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <OrderStatus status={order.status} />
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => toggleOrderDetails(order.id)}>
                        {expandedOrder === order.id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Collapse in={expandedOrder === order.id}>
                        <OrderDetails order={order} />
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyOrdersPage;
