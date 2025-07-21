// In-memory storage implementation for development
class MemoryStorage {
  constructor() {
    this.users = [];
    this.messages = [];
    this.rooms = [];
    this.activeUsers = new Map();
  }

  // User methods
  async createUser(userData) {
    const user = {
      id: Date.now().toString(),
      username: userData.username,
      password: userData.password, // In production, this should be hashed
      createdAt: new Date(),
      ...userData
    };
    this.users.push(user);
    return user;
  }

  async findUserByUsername(username) {
    return this.users.find(user => user.username === username);
  }

  async findUserById(id) {
    return this.users.find(user => user.id === id);
  }

  // Message methods
  async createMessage(messageData) {
    const message = {
      id: Date.now().toString(),
      content: messageData.content,
      sender: messageData.sender,
      room: messageData.room || 'general',
      timestamp: new Date(),
      type: messageData.type || 'text',
      ...messageData
    };
    this.messages.push(message);
    return message;
  }

  async getMessages(room = 'general', limit = 50) {
    return this.messages
      .filter(msg => msg.room === room)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-limit);
  }

  async getMessageById(id) {
    return this.messages.find(msg => msg.id === id);
  }

  // Room methods
  async createRoom(roomData) {
    const room = {
      id: Date.now().toString(),
      name: roomData.name,
      description: roomData.description || '',
      createdAt: new Date(),
      ...roomData
    };
    this.rooms.push(room);
    return room;
  }

  async getRooms() {
    return this.rooms;
  }

  async getRoomByName(name) {
    return this.rooms.find(room => room.name === name);
  }

  // Active user tracking
  addActiveUser(userId, socketId) {
    this.activeUsers.set(userId, {
      userId,
      socketId,
      joinedAt: new Date()
    });
  }

  removeActiveUser(userId) {
    this.activeUsers.delete(userId);
  }

  getActiveUsers() {
    return Array.from(this.activeUsers.values());
  }

  getUserBySocketId(socketId) {
    for (const [userId, data] of this.activeUsers.entries()) {
      if (data.socketId === socketId) {
        return { userId, ...data };
      }
    }
    return null;
  }
}

export const storage = new MemoryStorage();

// Initialize with default room
storage.createRoom({ name: 'general', description: 'General chat room' });