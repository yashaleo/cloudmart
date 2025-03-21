import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // ✅ Added PropTypes
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { ExpandMore, ExpandLess, Delete } from "@mui/icons-material";
import api from "../../config/axiosConfig";

const TicketStatus = ({ status }) => {
  const statusColors = {
    open: "success",
    closed: "error",
    in_progress: "warning",
  };
  return <Chip label={status} color={statusColors[status] || "default"} />;
};

// ✅ Added PropTypes for TicketStatus
TicketStatus.propTypes = {
  status: PropTypes.string.isRequired,
};

const TicketDetails = ({ ticket }) => (
  <Paper sx={{ mt: 2, p: 2, bgcolor: "grey.100" }}>
    <Typography variant="h6">Conversation:</Typography>
    {Array.isArray(ticket.conversation) ? (
      <ul>
        {ticket.conversation.map((msg, index) => (
          <li key={index}>
            <strong>{msg.sender}: </strong>
            {msg.text}
          </li>
        ))}
      </ul>
    ) : (
      <Typography>No conversation available.</Typography>
    )}
    {ticket.overallSentiment && (
      <Typography mt={2}>
        Sentiment:{" "}
        <Chip
          label={ticket.overallSentiment}
          color={
            ticket.overallSentiment === "positive"
              ? "success"
              : ticket.overallSentiment === "negative"
                ? "error"
                : "warning"
          }
        />
      </Typography>
    )}
  </Paper>
);

// ✅ Added PropTypes for TicketDetails
TicketDetails.propTypes = {
  ticket: PropTypes.shape({
    conversation: PropTypes.arrayOf(
      PropTypes.shape({
        sender: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      }),
    ),
    overallSentiment: PropTypes.string,
  }).isRequired,
};

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  ticketId,
  isLoading,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Deletion</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete ticket #{ticketId}? This action cannot
        be undone.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        color="error"
        variant="contained"
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={20} /> : "Delete"}
      </Button>
    </DialogActions>
  </Dialog>
);

// ✅ Added PropTypes for ConfirmDeleteModal
ConfirmDeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  ticketId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool.isRequired,
};

const AdminTicketView = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingTicket, setDeletingTicket] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      let url = "/tickets";
      if (statusFilter !== "all") {
        url += `/status?status=${statusFilter}`;
      }
      const response = await api.get(url);
      setTickets(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!deletingTicket) return;
    setIsDeleting(true);
    try {
      await api.delete(`/tickets/${deletingTicket}`);
      setTickets(tickets.filter((ticket) => ticket.id !== deletingTicket));
      setDeletingTicket(null);
    } catch {
      setError("Failed to delete ticket. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.100",
        backgroundColor: "rgba(192, 184, 184, 0.72)", // Light transparent background
        backdropFilter: "blur(8px)", // Adds a slight blur effect
        borderRadius: 2,
        padding: 2,
      }}
    >
      <Container sx={{ py: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Support Tickets
        </Typography>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </Select>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : tickets.length === 0 ? (
          <Typography>No tickets found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Sentiment</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <React.Fragment key={ticket.id}>
                    <TableRow>
                      <TableCell>#{ticket.id}</TableCell>
                      <TableCell>
                        {new Date(ticket.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <TicketStatus status={ticket.status} />
                      </TableCell>
                      <TableCell>
                        {ticket.overallSentiment && (
                          <Chip
                            label={ticket.overallSentiment}
                            color={
                              ticket.overallSentiment === "positive"
                                ? "success"
                                : ticket.overallSentiment === "negative"
                                  ? "error"
                                  : "warning"
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() =>
                            setExpandedTicket(
                              expandedTicket === ticket.id ? null : ticket.id,
                            )
                          }
                          startIcon={
                            expandedTicket === ticket.id ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )
                          }
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => setDeletingTicket(ticket.id)}
                          startIcon={<Delete />}
                          color="error"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedTicket === ticket.id && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <TicketDetails ticket={ticket} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <ConfirmDeleteModal
        open={!!deletingTicket}
        onClose={() => setDeletingTicket(null)}
        onConfirm={handleDeleteTicket}
        ticketId={deletingTicket}
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default AdminTicketView;
