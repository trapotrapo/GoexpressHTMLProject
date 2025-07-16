import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useChat } from '../../contexts/ChatContext';
import { X, Send, User, MessageSquare } from 'lucide-react';
import translations from '../../utils/translations';

interface ChatWidgetProps {
  onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const { messages, sendMessage } = useChat();
  const t = translations[language];
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          <h3 className="font-semibold">{t.liveChat}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors duration-200"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message */}
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-600 rounded-full p-2 mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg rounded-tl-none px-4 py-2 max-w-[75%]">
            <p className="text-sm">{t.chatWelcomeMessage}</p>
          </div>
        </div>
        
        {/* Message history */}
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender !== 'user' && (
              <div className="flex-shrink-0 bg-blue-600 rounded-full p-2 mr-3">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className={`px-4 py-2 rounded-lg max-w-[75%] ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70 mt-1 block text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            {msg.sender === 'user' && (
              <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-600 rounded-full p-2 ml-3">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.typeYourMessage}
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors duration-300"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget;