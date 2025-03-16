
import React, { useState, useRef, useEffect } from 'react';
import { useAdmin, ChatbotQuestion } from '../contexts/AdminContext';
import { X, Send, MessageCircle, ChevronDown, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ChatBot: React.FC = () => {
  const { chatbotConfig } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<ChatbotQuestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCharacter = chatbotConfig.characters.find(
    char => char.id === chatbotConfig.selectedCharacter
  ) || chatbotConfig.characters[0];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat is opened for the first time
      setMessages([{ text: chatbotConfig.welcomeMessage, isUser: false }]);
    }
  }, [isOpen, chatbotConfig.welcomeMessage, messages.length]);

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Focus input when chat is opened
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Search for matching questions when user types
    if (value.trim().length > 1) {
      setIsSearching(true);
      const results = chatbotConfig.questions.filter(q => 
        q.question.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    
    // Find matching question
    const matchedQuestion = chatbotConfig.questions.find(q => 
      q.question.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Add bot response after a short delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          text: matchedQuestion?.answer || "I'm not sure how to answer that. Can you try rephrasing or ask something else?", 
          isUser: false 
        }
      ]);
    }, 500);

    // Clear input and search results
    setInputValue('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const selectQuestion = (question: ChatbotQuestion) => {
    // Add selected question as user message
    setMessages(prev => [...prev, { text: question.question, isUser: true }]);
    
    // Add bot response after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, { text: question.answer, isUser: false }]);
    }, 500);

    // Clear input and search results
    setInputValue('');
    setSearchResults([]);
    setIsSearching(false);
  };

  if (!chatbotConfig.enabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="bg-black h-14 w-14 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-gray-800 transition-all"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden transition-all">
          {/* Chat header */}
          <div className="flex items-center p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img 
                  src={selectedCharacter.avatarUrl} 
                  alt={selectedCharacter.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedCharacter.name}</h3>
                <p className="text-xs text-gray-500">Virtual Assistant</p>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    message.isUser 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Search suggestions */}
          {isSearching && searchResults.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white max-h-32 overflow-y-auto">
              <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
              {searchResults.map(result => (
                <button
                  key={result.id}
                  onClick={() => selectQuestion(result)}
                  className="block w-full text-left p-2 text-sm hover:bg-gray-100 rounded"
                >
                  {result.question}
                </button>
              ))}
            </div>
          )}

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="p-3 border-t flex items-center">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              className="flex-1 bg-gray-100 border-transparent focus:border-transparent focus:ring-0"
            />
            <Button 
              type="submit" 
              className="ml-2" 
              disabled={!inputValue.trim()}
              size="icon"
            >
              <Send size={16} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
