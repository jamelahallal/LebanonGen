import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Send, Bot, ShieldAlert, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const injectStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cb-body {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #fafaf9;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
  }

  @keyframes cb-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cb-pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.4; transform:scale(.6); }
  }

  .cb-card {
    width: 100%;
    max-width: 840px;
    height: 82vh;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(127,29,29,0.03);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: cb-fadeUp 0.5s ease out;
  }

  .cb-header {
    padding: 20px 28px;
    background: #ffffff;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cb-header-left { display: flex; align-items: center; gap: 14px; }
  .cb-icon-frame {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(127,29,29,0.2);
  }
  .cb-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 24px;
    font-weight: 700;
    color: #7f1d1d;
    margin: 0;
  }
  .cb-subtitle {
    font-size: 13px;
    color: #9ca3af;
    margin: 2px 0 0 0;
    font-weight: 300;
  }

  .cb-close-btn {
    background: #f9fafb;
    border: 1px solid #f3f4f6;
    color: #9ca3af;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .cb-close-btn:hover { background: #f3f4f6; color: #111827; }

  .cb-chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
    background: #fffdfd;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .cb-msg-row { display: flex; width: 100%; gap: 12px; }
  .cb-msg-row.user { justify-content: flex-end; }
  .cb-msg-row.bot { justify-content: flex-start; }

  .cb-bubble {
    max-width: 75%;
    padding: 14px 18px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.6;
  }
  .cb-msg-row.user .cb-bubble {
    background: #7f1d1d;
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 12px rgba(127,29,29,0.12);
  }
  .cb-msg-row.bot .cb-bubble {
    background: #f9fafb;
    color: #1f2937;
    border-top-left-radius: 4px;
    border: 1px solid #f3f4f6;
  }

  .cb-bubble p { margin: 0 0 10px 0; }
  .cb-bubble p:last-child { margin-bottom: 0; }
  .cb-bubble ul, .cb-bubble ol { margin: 8px 0; padding-left: 20px; }

  .cb-avatar-bot {
    width: 32px; height: 32px; border-radius: 8px;
    background: #fef2f2; border: 1px solid #fee2e2;
    display: flex; align-items: center; justify-content: center;
    color: #b91c1c; flex-shrink: 0;
  }

  .cb-typing { display: flex; align-items: center; gap: 4px; padding: 6px 4px; }
  .cb-dot {
    width: 6px; height: 6px; background: #b91c1c; border-radius: 50%;
    animation: cb-pulse-dot 1.4s infinite ease-in-out both;
  }
  .cb-dot:nth-child(1) { animation-delay: -0.32s; }
  .cb-dot:nth-child(2) { animation-delay: -0.16s; }

  .cb-footer {
    padding: 20px 28px;
    background: #ffffff;
    border-top: 1px solid #f3f4f6;
  }
  .cb-disclaimer {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 14px; background: #fff5f5;
    padding: 10px 14px; border-radius: 10px;
    border: 1px solid #ffe3e3;
  }
  .cb-input-row { display: flex; gap: 12px; }
  .cb-input {
    flex: 1;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 14px;
    color: #111827;
    outline: none;
    transition: all 0.2s ease;
  }
  .cb-input:focus {
    background: #ffffff;
    border-color: #991b1b;
    box-shadow: 0 0 0 3px rgba(153,27,27,0.06);
  }
  .cb-send {
    background: #7f1d1d;
    color: #ffffff;
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .cb-send:hover:not(:disabled) { background: #991b1b; }
  .cb-send:disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }

  .cb-info-box {
    background: #f0fdf4; border: 1px solid #bbf7d0;
    border-radius: 12px; padding: 14px 18px;
    display: flex; gap: 12px; align-items: flex-start;
    margin-bottom: 8px; animation: cb-fadeUp 0.4s ease;
  }
`;

function ChatBot() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [contextData, setContextData] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedAssessment = localStorage.getItem("latestAssessmentData");
    if (savedAssessment) {
      try {
        const parsed = JSON.parse(savedAssessment);
        setContextData(parsed);
        setMessages([
          {
            sender: "bot",
            text: `Hello! I have loaded your diagnostic information into my context workspace. I can see your estimated result was **${parsed.riskLevel || "Analyzed"}**. How can I assist you with your report or family compatibility planning questions today?`,
          },
        ]);
      } catch (e) {
        console.error("Context mapping crash", e);
      }
    } else {
      setMessages([
        {
          sender: "bot",
          text: "Hello! I am your AI Genetic Assistant. Feel free to ask me anything about blood markers, inheritance configurations, or global metrics concerning Sickle Cell Disease.",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      const coupleID = localStorage.getItem("coupleID"); 

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ai/chat`,
        {
          message: userMessage, 
          coupleID: coupleID, 
        },
      );

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I experienced a system processing timeout. Please submit your prompt again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <style>{injectStyles}</style>
      <div className="cb-body">
        <div className="cb-card">
          {/* ── Header ── */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-icon-frame">
                <Bot size={22} />
              </div>
              <div>
                <h1 className="cb-title">{t("chatbot.title")}</h1>
                <p className="cb-subtitle">{t("chatbot.subtitle")}</p>
              </div>
            </div>
            <button className="cb-close-btn" onClick={() => navigate(-1)}>
              <X size={18} />
            </button>
          </div>

          {/* ── Chat Messages Display viewport ── */}
          <div className="cb-chat-area">
            {contextData && (
              <div className="cb-info-box">
                <Info
                  size={18}
                  color="#15803d"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: "#166534",
                    lineHeight: "1.5",
                  }}
                >
                  <strong>
                    {t("form.badge") || "Genetic Risk Assessment"}:
                  </strong>{" "}
                  Ready. Your calculated profile parameters have been structured
                  securely inside this chat interface.
                </span>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`cb-msg-row ${msg.sender}`}>
                {msg.sender === "bot" && (
                  <div className="cb-avatar-bot">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className="cb-bubble"
                  style={{
                    textAlign: isRtl ? "right" : "left",
                    direction: isRtl ? "rtl" : "ltr",
                  }}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="cb-msg-row bot">
                <div className="cb-avatar-bot">
                  <Bot size={16} />
                </div>
                <div className="cb-bubble" style={{ minWidth: "60px" }}>
                  <div className="cb-typing">
                    <div className="cb-dot" />
                    <div className="cb-dot" />
                    <div className="cb-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ── Footer Input Block ── */}
          <div className="cb-footer">
            <div className="cb-disclaimer">
              <ShieldAlert size={13} color="#b91c1c" />
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                {t("form.disclaimer") ||
                  "Educational guidance only · Not a substitute for medical advice"}
              </p>
            </div>
            <form onSubmit={handleSend} className="cb-input-row">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatbot.placeholder")}
                className="cb-input"
                style={{
                  textAlign: isRtl ? "right" : "left",
                  direction: isRtl ? "rtl" : "ltr",
                }}
              />
              <button
                type="submit"
                className="cb-send"
                disabled={!input.trim() || isTyping}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatBot;
