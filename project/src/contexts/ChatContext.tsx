import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from './LanguageContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { language } = useLanguage();
  
  // Initial agent message when chat opens
  useEffect(() => {
    // Clear previous messages when language changes
    const welcomeMessage = getWelcomeMessage();
    setMessages([
      {
        id: uuidv4(),
        sender: 'agent',
        text: welcomeMessage,
        timestamp: new Date()
      }
    ]);
  }, [language]);
  
  const getWelcomeMessage = () => {
    switch (language) {
      case 'fr':
        return "Bonjour ! Comment puis-je vous aider aujourd'hui avec votre expédition ?";
      case 'es':
        return "¡Hola! ¿Cómo puedo ayudarte hoy con tu envío?";
      default:
        return "Hello! Our customer service representatives are currently assisting other customers. If you need immediate assistance, please kindly contact our customer support team for assistance with your shipment at +1252-655-2297 or Send us an email at support@goexpresswideworld.com.";
    }
  };

  const sendMessage = (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'agent',
        text: getAutoResponse(text, language),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: uuidv4(),
        sender: 'agent',
        text: getWelcomeMessage(),
        timestamp: new Date()
      }
    ]);
  };
  
  const value = {
    messages,
    sendMessage,
    clearChat
  };
  
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Helper to generate auto responses based on user input
const getAutoResponse = (text: string, language: string): string => {
  const lowerText = text.toLowerCase();
  
  // Check for tracking number request
  if (lowerText.includes('track') || lowerText.includes('status') || 
      lowerText.includes('where') || lowerText.includes('suivre') ||
      lowerText.includes('estado') || lowerText.includes('dónde')) {
    switch (language) {
      case 'fr':
        return "Pour suivre votre colis, veuillez utiliser l'outil de suivi sur notre page d'accueil et saisir votre numéro de suivi.";
      case 'es':
        return "Para rastrear su paquete, utilice la herramienta de seguimiento en nuestra página de inicio e ingrese su número de seguimiento.";
      default:
        return "To track your package, please use the tracking tool on our home page and enter your tracking number.";
    }
  }
  
  // Check for delivery time question
  if (lowerText.includes('when') || lowerText.includes('delivery') || lowerText.includes('arrive') ||
      lowerText.includes('quand') || lowerText.includes('livraison') || 
      lowerText.includes('cuándo') || lowerText.includes('entrega')) {
    switch (language) {
      case 'fr':
        return "Les délais de livraison dépendent de la destination et du service d'expédition que vous avez choisi. Vous pouvez voir l'estimation sur votre page de suivi.";
      case 'es':
        return "Los tiempos de entrega dependen del destino y del servicio de envío que haya elegido. Puede ver la estimación en su página de seguimiento.";
      default:
        return "Delivery times depend on the destination and shipping service you've chosen. You can see the estimate on your tracking page.";
    }
  }
  
  // Check for problem or help request
  if (lowerText.includes('problem') || lowerText.includes('help') || lowerText.includes('issue') ||
      lowerText.includes('problème') || lowerText.includes('aide') || 
      lowerText.includes('problema') || lowerText.includes('ayuda')) {
    switch (language) {
      case 'fr':
        return "Je suis désolé d'apprendre que vous rencontrez des difficultés. Pourriez-vous me fournir plus de détails sur le problème, y compris votre numéro de suivi si possible ?";
      case 'es':
        return "Lamento saber que está teniendo dificultades. ¿Podría proporcionarme más detalles sobre el problema, incluido su número de seguimiento si es posible?";
      default:
        return "I'm sorry to hear you're experiencing difficulties. Could you provide more details about the issue, including your tracking number if possible?";
    }
  }
  
  // Generic response for other inquiries
  switch (language) {
    case 'fr':
      return "Merci pour votre message. Comment puis-je vous aider davantage avec votre question sur l'expédition ?";
    case 'es':
      return "Gracias por su mensaje. ¿Cómo puedo ayudarle más con su consulta de envío?";
    default:
      return "Thank you for your message. How can I further assist you with your shipping inquiry?";
  }
};