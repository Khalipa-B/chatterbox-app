import { useState, useEffect } from "react";
import ChatContainer from "@/components/Chat/ChatContainer";
import { useSocket } from "@/hooks/useSocket";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const {
    socket,
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    joinChat,
    sendMessage,
    startTyping,
    stopTyping
  } = useSocket();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (username.trim() && !isJoining) {
      setIsJoining(true);
      try {
        const userData = await joinChat(username.trim());
        setUser(userData);
      } catch (error) {
        console.error('Failed to join chat:', error);
        setIsJoining(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">ChatFlow</h1>
            <p className="text-gray-600">Enter your name to join the chat</p>
          </div>
          
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your username"
                disabled={isJoining}
                maxLength={30}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={!username.trim() || isJoining}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isJoining ? "Joining..." : "Join Chat"}
            </button>
          </form>
          
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-600">
              {isConnected ? "Connected to server" : "Connecting..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ChatContainer
      user={user}
      messages={messages}
      onlineUsers={onlineUsers}
      typingUsers={typingUsers}
      isConnected={isConnected}
      onSendMessage={sendMessage}
      onStartTyping={startTyping}
      onStopTyping={stopTyping}
    />
  );
}
