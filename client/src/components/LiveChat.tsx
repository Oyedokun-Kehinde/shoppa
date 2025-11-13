import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import api from '../lib/api';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'greeting' | 'question' | 'details' | 'complete'>('greeting');
  const [userQuestion, setUserQuestion] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage("👋 Hi there! Welcome to Shoppa! I'm your virtual assistant. How can I help you today?");
        setStep('question');
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    addUserMessage(userInput);
    setInput('');

    if (step === 'question') {
      setUserQuestion(userInput);
      setTimeout(() => {
        addBotMessage("Thanks for sharing! To assist you better, may I have your name?");
        setStep('details');
      }, 800);
    } else if (step === 'details' && !userName) {
      setUserName(userInput);
      setTimeout(() => {
        addBotMessage(`Nice to meet you, ${userInput}! 😊 And your email address?`);
      }, 800);
    } else if (step === 'details' && userName && !userEmail) {
      setUserEmail(userInput);
      setTimeout(() => {
        addBotMessage("Perfect! Let me submit your inquiry. One moment please... ⏳");
        submitToDatabase(userName, userInput, userQuestion);
      }, 800);
    }
  };

  const submitToDatabase = async (name: string, email: string, question: string) => {
    try {
      await api.post('/chat/submit', {
        name,
        email,
        question,
      });

      setTimeout(() => {
        addBotMessage(
          `✅ Thank you, ${name}! Your inquiry has been submitted successfully. Our team will get back to you at ${email} within 24 hours. Is there anything else I can help you with?`
        );
        setStep('complete');
      }, 1500);
    } catch (error) {
      console.error('Failed to submit chat:', error);
      addBotMessage(
        "⚠️ Sorry, there was an error submitting your inquiry. Please try again or contact us directly at support@shoppa.com"
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary-dark transition-all duration-300 transform hover:scale-110 z-50 animate-bounce"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            1
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-fade-in">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Shoppa Support</h3>
                <p className="text-xs text-white/80">We typically reply instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="bg-primary/10 p-1 rounded-full">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">Support Agent</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span
                    className={`text-xs ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                    } mt-1 block`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by Shoppa • We respect your privacy
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;
