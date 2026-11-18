import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { Sparkles, Send, Bot, User, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AiAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am the **CampusFix AI Assistant** for NIE North Campus. How can I help you today? You can ask me how to report complaints, understand repair timelines, or report Wi-Fi and electrical issues.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "How do I report an issue?",
    "How do I track my complaint?",
    "What does IN_PROGRESS mean?",
    "How do I report Wi-Fi problems?",
    "What information should I provide?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.ai.chat(textToSend.trim());
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.reply,
        helpfulLinks: res.helpfulLinks,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I'm having trouble connecting right now. You can still report issues directly through the **Submit Complaint** form.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #1e40af, #4f46e5)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#0f172a' }}>CampusFix AI Assistant</h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Intelligent Campus Maintenance Advisor • Powered by Google Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {/* Messages List */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              {m.sender === 'ai' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Bot size={18} />
                </div>
              )}

              <div>
                <div style={{
                  backgroundColor: m.sender === 'user' ? '#1e40af' : '#f8fafc',
                  color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  borderTopRightRadius: m.sender === 'user' ? '4px' : '16px',
                  borderTopLeftRadius: m.sender === 'ai' ? '4px' : '16px',
                  border: m.sender === 'ai' ? '1px solid #e2e8f0' : 'none',
                  fontSize: '0.92rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.text}

                  {m.helpfulLinks && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <Link to="/student/submit-complaint" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                        Submit Complaint →
                      </Link>
                      <Link to="/student/my-complaints" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                        Track Complaints →
                      </Link>
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', display: 'block', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                  {m.time}
                </span>
              </div>

              {m.sender === 'user' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px 18px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.88rem' }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Chips */}
        <div style={{ padding: '8px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', overflowX: 'auto', backgroundColor: '#f8fafc' }}>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(p)}
              disabled={loading}
              className="btn btn-sm"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
                whiteSpace: 'nowrap',
                color: '#334155',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Ask CampusFix Assistant a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="btn btn-primary"
            style={{ padding: '10px 18px' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
