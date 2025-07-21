export const createUser = (data) => ({
  id: data.id,
  username: data.username,
  isOnline: data.isOnline || false,
  lastSeen: data.lastSeen || new Date(),
  status: data.status || 'offline' // online, away, offline
});

export const createMessage = (data) => ({
  id: data.id,
  content: data.content,
  userId: data.userId,
  username: data.username,
  timestamp: data.timestamp || new Date(),
  type: data.type || 'message' // message, system, join, leave
});

export const createRoom = (data) => ({
  id: data.id,
  name: data.name,
  description: data.description || '',
  users: data.users || []
});
