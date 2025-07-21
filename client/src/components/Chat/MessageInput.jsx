import { useState, useRef, useEffect } from "react";

export default function MessageInput({ 
  onSendMessage, 
  onStartTyping, 
  onStopTyping, 
  typingUsers,
  currentUser 
}) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      
      // Stop typing indicator
      if (isTyping) {
        onStopTyping();
        setIsTyping(false);
      }
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    
    // Handle typing indicators
    if (e.target.value.trim() && !isTyping) {
      setIsTyping(true);
      onStartTyping();
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onStopTyping();
      }
    }, 1000);
  };

  const handleQuickReaction = (emoji) => {
    onSendMessage(emoji);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const getTypingUsersText = () => {
    const otherTypingUsers = typingUsers.filter(username => username !== currentUser?.username);
    if (otherTypingUsers.length === 0) return "";
    if (otherTypingUsers.length === 1) return `${otherTypingUsers[0]} is typing...`;
    if (otherTypingUsers.length === 2) return `${otherTypingUsers[0]} and ${otherTypingUsers[1]} are typing...`;
    return `${otherTypingUsers[0]} and ${otherTypingUsers.length - 1} others are typing...`;
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-end space-x-3">
          <button
            type="button"
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-smile text-xl"></i>
          </button>
          
          <div className="flex-1">
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows="1"
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                placeholder="Type a message..."
                maxLength={500}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-paperclip"></i>
              </button>
            </div>
            
            {/* Character count and typing indicator */}
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">{getTypingUsersText()}</p>
              <p className="text-xs text-gray-400">{message.length}/500</p>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!message.trim()}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        
        {/* Quick reactions */}
        <div className="flex space-x-2">
          {['👍', '❤️', '😄', '🔥'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleQuickReaction(emoji)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
