import { useEffect, useRef } from "react";

export default function MessageList({ messages, currentUser, typingUsers }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInitials = (username) => {
    return username?.slice(0, 2).toUpperCase() || '??';
  };

  const groupMessages = (messages) => {
    const grouped = [];
    let currentGroup = null;

    messages.forEach((message) => {
      if (message.type === 'system' || message.type === 'join' || message.type === 'leave') {
        grouped.push({ type: 'system', message });
        currentGroup = null;
      } else if (!currentGroup || currentGroup.userId !== message.userId) {
        currentGroup = {
          userId: message.userId,
          username: message.username,
          messages: [message]
        };
        grouped.push(currentGroup);
      } else {
        currentGroup.messages.push(message);
      }
    });

    return grouped;
  };

  const groupedMessages = groupMessages(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {groupedMessages.map((group, groupIndex) => {
        if (group.type === 'system') {
          return (
            <div key={`system-${groupIndex}`} className="flex justify-center">
              <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                <i className="fas fa-info-circle mr-1"></i>
                {group.message.content}
              </div>
            </div>
          );
        }

        const isCurrentUser = group.userId === currentUser?.id;

        if (isCurrentUser) {
          return (
            <div key={`group-${groupIndex}`} className="flex justify-end">
              <div className="max-w-xs lg:max-w-md space-y-1">
                {group.messages.map((message) => (
                  <div key={message.id} className="bg-indigo-600 text-white rounded-lg px-4 py-2 shadow-sm">
                    <p>{message.content}</p>
                  </div>
                ))}
                <p className="text-xs text-gray-500 text-right">
                  {formatTime(group.messages[group.messages.length - 1].timestamp)}
                </p>
              </div>
            </div>
          );
        }

        return (
          <div key={`group-${groupIndex}`} className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                {getInitials(group.username)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-semibold text-gray-900">{group.username}</p>
                <p className="text-xs text-gray-500">
                  {formatTime(group.messages[0].timestamp)}
                </p>
              </div>
              <div className="space-y-1">
                {group.messages.map((message) => (
                  <div key={message.id} className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                    <p className="text-gray-900">{message.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicators */}
      {typingUsers.length > 0 && (
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
              {getInitials(typingUsers[0])}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm font-semibold text-gray-900">{typingUsers[0]}</p>
              <p className="text-xs text-green-500 font-medium">typing...</p>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
