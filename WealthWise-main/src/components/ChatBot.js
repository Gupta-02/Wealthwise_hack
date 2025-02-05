import React, { useState, useRef, useEffect } from 'react';
import { Send, X, BadgeDollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const ChatBot = ({ mail }) => {
  const navigate = useNavigate();

  function formatChatbotResponse(response) {
    return response
      .replace(/\n/g, '<br>') 
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
  }

  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hi there! I'm Niveshak, an AI assistant. How can I help you today?",
      sender: 'Niveshak',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [messageButton, setMessageButton] = useState(true);
  const [nivloading,setnivloading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    setnivloading(true);
    if (input.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    inputRef.current?.focus();
    setIsLoading(true);

    try {
      const sessionToken = Cookies.get('sessionToken');
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}chatbot4`,
        { question: input },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      const chatBotMessage = {
        id: messages.length +2,
        content: formatChatbotResponse(response.data.answer),
        sender: 'Niveshak',
        timestamp: new Date(),
      };

      setIsLoading(false);
      setMessages((prev) => [...prev, chatBotMessage]);
      setnivloading(false);
      console.log(nivloading);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setnivloading(false);

    } finally {
      setIsLoading(false);
      setnivloading(false);
      

    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey &&  !isLoading) {
      e.preventDefault();
      setnivloading(true);
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        fixed inset-0 z-50 bg-transparent-900/90 backdrop-blur-sm 
        bg-gradient-to-br from-blue-900/70 to-purple-900/70
        ${isMinimized ? 'h-16 bottom-0 w-full' : 'h-full'}
        flex flex-col
      `}
    >
      {/* Window Controls */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-red-700 text-white p-2 rounded-full hover:bg-red-600"
          onClick={() => navigate('/home')}
        >
          <X />
        </motion.button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-blue-800/50 to-purple-800/50 p-4 text-white"
      >
        <h2 className="text-xl font-bold">Chat with Niveshak</h2>
        <p className="text-sm">Your intelligent assistant</p>
      </motion.div>

      {/* Messages Container */}
      <div
        className={`
        flex-grow overflow-y-auto p-4 space-y-4
        ${isMinimized ? 'h-0' : ''}
      `}
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'user' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] p-3 rounded-lg shadow-md
                  ${msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200'}
                `}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                <div className="text-xs text-opacity-70 mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>

        <AnimatePresence>
          {nivloading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-700 p-3 rounded-lg flex items-center text-white">
                <BadgeDollarSign className="mr-2 h-4 w-4 animate-spin text-purple-400" />
                <span>Niveshak is typing...</span>
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          border-t border-gray-600 p-4 bg-gray-800/50 
          ${isMinimized ? 'hidden' : 'block'}
        `}
      >
        <div className="flex items-center space-x-2">
        <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress} 
            placeholder="Message Niveshak..."
            
            className="
              flex-grow p-2 border border-gray-600 bg-gray-800 text-white rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-purple-500
              resize-none h-20
              disabled:bg-gray-700 disabled:text-gray-400
            "
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={input.trim() === '' || isLoading}
            className="
              bg-gradient-to-r from-blue-600 to-purple-600 
              text-white p-3 rounded-full 
              disabled:opacity-50 transition-all
            "
          >
            <Send className="h-6 w-6" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatBot;
