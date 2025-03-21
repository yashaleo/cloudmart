import React, { useState, useEffect, useRef } from "react";
import { Send, Add, Delete } from "@mui/icons-material";
import {
  Container,
  Box,
  Paper,
  Button,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import api from "../../config/axiosConfig";

const CustomerSupportPage = () => {
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadThreadsFromLocalStorage();
  }, []);

  useEffect(() => {
    if (currentThreadId) {
      loadMessagesForThread(currentThreadId);
    } else {
      setMessages([]); // Clear messages when no thread is selected
    }
  }, [currentThreadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load threads from local storage
  const loadThreadsFromLocalStorage = () => {
    try {
      const savedThreads =
        JSON.parse(localStorage.getItem("supportThreads")) || [];
      setThreads(savedThreads);
      if (savedThreads.length > 0) {
        setCurrentThreadId(savedThreads[0].id);
      }
    } catch (error) {
      console.error("Error loading threads from storage:", error);
      localStorage.removeItem("supportThreads"); // Remove corrupt data
    }
  };

  // Fetch messages for a given thread
  const loadMessagesForThread = async (threadId) => {
    try {
      const response = await api.get(`/ai/messages?threadId=${threadId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]); // Fallback to empty messages
    }
  };

  // Create a new thread
  const createNewThread = async () => {
    try {
      const response = await api.post("/ai/start");
      const newThread = {
        id: response.data.threadId,
        name: `Thread ${threads.length + 1}`,
      };
      const updatedThreads = [newThread, ...threads];
      setThreads(updatedThreads);
      localStorage.setItem("supportThreads", JSON.stringify(updatedThreads));
      setCurrentThreadId(newThread.id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating new thread:", error);
    }
  };

  // Delete a thread
  const deleteThread = (threadId) => {
    const updatedThreads = threads.filter((thread) => thread.id !== threadId);
    setThreads(updatedThreads);
    localStorage.setItem("supportThreads", JSON.stringify(updatedThreads));

    // Reset current thread if the deleted thread was active
    if (currentThreadId === threadId) {
      setCurrentThreadId(
        updatedThreads.length > 0 ? updatedThreads[0].id : null,
      );
      setMessages([]);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentThreadId || isLoading) return;

    const newMessage = { text: inputMessage, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await api.post("/ai/message", {
        threadId: currentThreadId,
        message: inputMessage,
      });
      setIsTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.response, sender: "ai" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to the bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Customer Support
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={createNewThread}
          sx={{ mb: 2 }}
        >
          New Thread
        </Button>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <List>
            {threads.map((thread) => (
              <ListItem
                key={thread.id}
                button
                onClick={() => setCurrentThreadId(thread.id)}
              >
                <ListItemText primary={thread.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => deleteThread(thread.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, height: "400px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                textAlign: msg.sender === "user" ? "right" : "left",
                mb: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  display: "inline-block",
                  p: 1,
                  borderRadius: 1,
                  bgcolor: msg.sender === "user" ? "primary.main" : "grey.300",
                  color: msg.sender === "user" ? "white" : "black",
                }}
              >
                {msg.text}
              </Typography>
            </Box>
          ))}
          {isTyping && <Typography variant="body2">Typing...</Typography>}
          <div ref={messagesEndRef} />
        </Paper>
        <Box mt={2} display="flex">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={isLoading}
            sx={{ ml: 1 }}
          >
            {isLoading ? <CircularProgress size={24} /> : <Send />}
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

export default CustomerSupportPage;
