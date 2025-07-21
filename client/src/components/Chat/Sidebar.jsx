import UserList from "./UserList";

export default function Sidebar({ onlineUsers, isConnected, currentUser }) {
  return (
    <>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">ChatFlow</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">{onlineUsers.length} online</span>
          </div>
        </div>
      </div>

      {/* Room Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-hashtag text-indigo-600"></i>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">General Chat</h2>
            <p className="text-sm text-gray-500">Main discussion room</p>
          </div>
        </div>
      </div>

      {/* Online Users List */}
      <div className="flex-1 overflow-y-auto">
        <UserList users={onlineUsers} currentUser={currentUser} />
      </div>

      {/* Connection Status */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-gray-600">
            {isConnected ? "Connected to server" : "Disconnected"}
          </span>
        </div>
      </div>
    </>
  );
}
