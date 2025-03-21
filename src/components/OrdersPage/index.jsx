import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { ChevronDown, ChevronUp, Delete } from "lucide-react";
import api from "../../config/axiosConfig";

const OrderStatus = ({ status, onStatusChange }) => (
  <Select value={status} onChange={(e) => onStatusChange(e.target.value)}>
    {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
      (option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ),
    )}
  </Select>
);

// ✅ Adding PropTypes for OrderStatus
OrderStatus.propTypes = {
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (err) {
      alert("Failed to update order status. Please try again.");
    }
  };

  const handleDeleteOrder = async () => {
    if (!deletingOrder) return;
    setIsDeleting(true);
    try {
      await api.delete(`/orders/${deletingOrder}`);
      setOrders(orders.filter((order) => order.id !== deletingOrder));
      setDeletingOrder(null);
    } catch (err) {
      alert("Failed to delete order. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="container mx-auto py-8 flex-grow">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>User Email</TableCell>
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
                    <TableCell>{order.userEmail}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <OrderStatus
                        status={order.status}
                        onStatusChange={(newStatus) =>
                          handleStatusChange(order.id, newStatus)
                        }
                      />
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id,
                          )
                        }
                        startIcon={
                          expandedOrder === order.id ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )
                        }
                      >
                        Details
                      </Button>
                      <Button
                        onClick={() => setDeletingOrder(order.id)}
                        startIcon={<Delete />}
                        color="error"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedOrder === order.id && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <p>Order Items:</p>
                        {order.items.map((item, index) => (
                          <p key={index}>
                            {item.name} - Quantity: {item.quantity} - $
                            {item.price}
                          </p>
                        ))}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingOrder} onClose={() => setDeletingOrder(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete order #{deletingOrder}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingOrder(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteOrder}
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

// ✅ Adding PropTypes for AdminOrdersPage
AdminOrdersPage.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userEmail: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          price: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }),
  ),
};

export default AdminOrdersPage;
