import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Bot, User, ShieldAlert } from "lucide-react";
import "../styles/chat.css";

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your LebanonGen Assistant. How can I help with your genetic data today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Get CoupleID from local storage to context-link the chat
  const coupleId = localStorage.getItem("coupleId");

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;
    if (!coupleId) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "User session not found. Please log in again to discuss your genetic data.",
        },
      ]);
      return;
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/api/ai-chat", {
        coupleId: coupleId,
        message: input,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data.reply },
      ]);
    } catch (error) {
      console.error("=== FULL GEMINI ERROR ===");
      console.error("Error message:", error.message);
      console.error("Error status:", error.status);
      console.error("Error stack:", error.stack);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
      console.error("=========================");

      // ✅ FIXED: Don't use res.status() in frontend!
      // Just show the error message to the user
      const errorMessage =
        error.response?.data?.reply ||
        error.message ||
        "The AI service is currently unavailable.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Error: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-card">
        <div className="chat-header">
          <div className="header-info">
            <Bot size={24} color="#b30000" />
            <div>
              <h3>Genetic AI Assistant</h3>
              <span className="status-online">Online</span>
            </div>
          </div>
        </div>

        <div className="message-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender}`}>
              <div className="avatar">
                {msg.sender === "bot" ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper bot">
              <div className="avatar">
                <Bot size={18} />
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="disclaimer">
          <ShieldAlert size={14} />
          <span>
            AI info is for guidance. Consult a doctor for final diagnosis.
          </span>
        </div>

        <form className="chat-footer" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about genotypes or compatibility..."
          />
          <button type="submit" disabled={!input.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
