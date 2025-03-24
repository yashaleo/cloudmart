import React, { useState, useEffect, useRef } from "react";
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
  Divider,
} from "@mui/material";
import { Send, Add, Delete } from "@mui/icons-material";
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
      setMessages([]);
    }
  }, [currentThreadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
      localStorage.removeItem("supportThreads");
    }
  };

  const loadMessagesForThread = async (threadId) => {
    try {
      const response = await api.get(`/ai/messages?threadId=${threadId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    }
  };

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

  const deleteThread = (threadId) => {
    const updatedThreads = threads.filter((thread) => thread.id !== threadId);
    setThreads(updatedThreads);
    localStorage.setItem("supportThreads", JSON.stringify(updatedThreads));

    if (currentThreadId === threadId) {
      setCurrentThreadId(updatedThreads[0]?.id || null);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentThreadId || isLoading) return;

    const newMessage = { text: inputMessage, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await api.post("/ai/message", {
        threadId: currentThreadId,
        message: inputMessage,
      });
      setMessages((prev) => [
        ...prev,
        { text: response.data.response, sender: "ai" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Customer Support
      </Typography>
      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Sidebar - Thread List */}
        <Box width="25%">
          <Button
            variant="contained"
            startIcon={<Add />}
            fullWidth
            onClick={createNewThread}
            sx={{ mb: 2 }}
          >
            New Thread
          </Button>
          <Paper elevation={2}>
            <List dense>
              {threads.map((thread) => (
                <ListItem
                  key={thread.id}
                  button
                  selected={thread.id === currentThreadId}
                  onClick={() => setCurrentThreadId(thread.id)}
                  divider
                >
                  <ListItemText
                    primary={thread.name}
                    primaryTypographyProps={{ noWrap: true }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => deleteThread(thread.id)}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Chat Area */}
        <Box width="75%" display="flex" flexDirection="column">
          <Paper
            elevation={2}
            sx={{
              p: 2,
              flexGrow: 1,
              minHeight: "400px",
              overflowY: "auto",
              mb: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    display: "inline-block",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    bgcolor:
                      msg.sender === "user" ? "primary.main" : "grey.300",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
            {isTyping && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Typing...
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Paper>

          {/* Message Input */}
          <Box display="flex">
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={!currentThreadId || isLoading}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!currentThreadId || isLoading}
              sx={{ ml: 1 }}
              color="primary"
            >
              {isLoading ? <CircularProgress size={24} /> : <Send />}
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default CustomerSupportPage;
