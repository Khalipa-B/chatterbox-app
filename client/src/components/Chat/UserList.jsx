export default function UserList({ users, currentUser }) {
  const getInitials = (username) => {
    return username?.slice(0, 2).toUpperCase() || '??';
  };

  const getStatusColor = (user) => {
    if (user.status === 'online') return 'bg-green-500';
    if (user.status === 'away') return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getStatusText = (user) => {
    if (user.status === 'online') return 'Active now';
    if (user.status === 'away') return 'Away';
    return 'Offline';
  };

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Online Users ({users.length})
      </h3>
      
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                {getInitials(user.username)}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${getStatusColor(user)}`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.username}
                {user.id === currentUser?.id && (
                  <span className="text-xs text-gray-500 ml-1">(you)</span>
                )}
              </p>
              <p className="text-xs text-gray-500">{getStatusText(user)}</p>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No users online</p>
          </div>
        )}
      </div>
    </div>
  );
}
