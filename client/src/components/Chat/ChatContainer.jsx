import { useState } from "react";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatContainer({
  user,
  messages,
  onlineUsers,
  typingUsers,
  isConnected,
  onSendMessage,
  onStartTyping,
  onStopTyping
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className={`w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col ${sidebarOpen ? 'block' : 'hidden'} lg:flex`}>
        <Sidebar
          onlineUsers={onlineUsers}
          isConnected={isConnected}
          currentUser={user}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">General Chat</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">{onlineUsers.length}</span>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-hashtag text-indigo-600"></i>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">General Chat</h2>
                <p className="text-sm text-gray-500">{onlineUsers.length} members active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={messages}
            currentUser={user}
            typingUsers={typingUsers}
          />
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={onSendMessage}
          onStartTyping={onStartTyping}
          onStopTyping={onStopTyping}
          typingUsers={typingUsers}
          currentUser={user}
        />
      </div>
    </div>
  );
}
