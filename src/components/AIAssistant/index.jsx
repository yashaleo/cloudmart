import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Box,
  Paper,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import { MessageCircle, X, Send } from "lucide-react";
import api from "../../config/axiosConfig";

const TypingIndicator = () => (
  <Box
    display="flex"
    alignItems="center"
    gap={1}
    bgcolor="grey.300"
    px={2}
    py={1}
    borderRadius={2}
  >
    <Box
      width={8}
      height={8}
      bgcolor="grey.600"
      borderRadius="50%"
      sx={{ animation: "bounce 1.5s infinite" }}
    />
    <Box
      width={8}
      height={8}
      bgcolor="grey.600"
      borderRadius="50%"
      sx={{ animation: "bounce 1.5s infinite", animationDelay: "0.15s" }}
    />
    <Box
      width={8}
      height={8}
      bgcolor="grey.600"
      borderRadius="50%"
      sx={{ animation: "bounce 1.5s infinite", animationDelay: "0.3s" }}
    />
  </Box>
);

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !conversationId) {
      startNewConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const startNewConversation = async () => {
    try {
      const response = await api.post("/ai/bedrock/start");
      setConversationId(response.data.conversationId);
    } catch (error) {
      console.error("Error starting new conversation:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversationId || isLoading) return;

    setMessages((prev) => [...prev, { text: inputMessage, sender: "user" }]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await api.post("/ai/bedrock/message", {
        conversationId,
        message: inputMessage,
      });

      setIsTyping(false);

      const aiResponseText =
        response.data?.message ||
        response.data?.response?.message ||
        response.data?.response ||
        "Sorry, I couldn't process that response.";

      setMessages((prev) => [...prev, { text: aiResponseText, sender: "ai" }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { text: "Error processing request.", sender: "ai" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            bgcolor: "primary.main",
            color: "white",
            ":hover": { bgcolor: "primary.dark" },
          }}
        >
          <MessageCircle size={24} />
        </IconButton>
      )}
      {isOpen && (
        <Paper
          elevation={4}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            width: 380,
            height: 600,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "'Inter', sans-serif", // Updated font for a modern professional look
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="primary.main"
            color="white"
            p={2}
          >
            <Typography
              variant="h6"
              sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            >
              AI Assistant
            </Typography>
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{ color: "white" }}
            >
              <X size={20} />
            </IconButton>
          </Box>
          <Box flexGrow={1} p={2} overflow="auto" sx={{ bgcolor: "grey.100" }}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  msg.sender === "user" ? "flex-end" : "flex-start"
                }
                mb={1}
              >
                <Box
                  sx={{
                    bgcolor:
                      msg.sender === "user" ? "primary.main" : "grey.300",
                    color: msg.sender === "user" ? "white" : "black",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.95rem",
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </Box>
          <Box display="flex" p={2} borderTop={1} borderColor="grey.300">
            <TextField
              fullWidth
              variant="outlined"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              disabled={isLoading}
              sx={{ fontFamily: "'Inter', sans-serif" }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={isLoading}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                ml: 1,
                ":hover": { bgcolor: "primary.dark" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Send size={24} />
              )}
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default AIAssistant;
