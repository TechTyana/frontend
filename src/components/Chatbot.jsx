import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am the EAZY AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const [activeModel, setActiveModel] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'model', text: 'Error: API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.' }]);
        setIsLoading(false);
        return;
      }

      let modelToUse = activeModel;
      if (!modelToUse) {
        try {
          const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
          const listData = await listRes.json();
          if (listData.models) {
            const hasGenContent = m => m.supportedGenerationMethods?.includes("generateContent");
            // Prefer flash, otherwise any gemini model
            const bestModel = listData.models.find(m => hasGenContent(m) && m.name.includes("flash")) 
                           || listData.models.find(m => hasGenContent(m) && m.name.includes("gemini"));
            if (bestModel) {
              modelToUse = bestModel.name.replace('models/', '');
              setActiveModel(modelToUse);
            } else {
              modelToUse = 'gemini-1.5-flash';
            }
          } else {
            modelToUse = 'gemini-1.5-flash';
          }
        } catch (e) {
          console.warn("Failed to list models, defaulting to gemini-1.5-flash", e);
          modelToUse = 'gemini-1.5-flash';
        }
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: newMessages.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          }))
        })
      });

      const data = await response.json();
      
      if (response.ok && data.candidates && data.candidates.length > 0) {
        const botText = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'model', text: botText }]);
      } else {
        console.error("API Error", data);
        const errorMsg = data.error?.message || 'Unknown API error';
        setMessages(prev => [...prev, { role: 'model', text: `API Error: ${errorMsg}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Network error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={toggleChat}>
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window card">
          <div className="chatbot-header">
            <div className="flex align-center gap-2 text-white font-bold">
              <MessageSquare size={20} />
              EAZY Assistant
            </div>
            <button className="chatbot-close text-white" onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message-bubble model loading">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading} className="send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
