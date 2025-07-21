export class MemStorage {
  constructor() {
    this.users = new Map();
    this.messages = [];
    this.activeUsers = new Map(); // socketId -> user mapping
    this.typingUsers = new Set();
    this.currentUserId = 1;
    this.currentMessageId = 1;
  }

  // User methods
  createUser(userData) {
    const id = this.currentUserId++;
    const user = {
      id,
      username: userData.username,
      isOnline: true,
      lastSeen: new Date(),
      status: 'online'
    };
    this.users.set(id, user);
    return user;
  }

  getUserById(id) {
    return this.users.get(id);
  }

  getUserByUsername(username) {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  updateUserStatus(userId, status) {
    const user = this.users.get(userId);
    if (user) {
      user.status = status;
      user.isOnline = status === 'online';
      user.lastSeen = new Date();
      this.users.set(userId, user);
    }
    return user;
  }

  // Active users (socket connections)
  addActiveUser(socketId, user) {
    this.activeUsers.set(socketId, user);
  }

  removeActiveUser(socketId) {
    const user = this.activeUsers.get(socketId);
    this.activeUsers.delete(socketId);
    return user;
  }

  getActiveUsers() {
    return Array.from(this.activeUsers.values());
  }

  getUserBySocketId(socketId) {
    return this.activeUsers.get(socketId);
  }

  // Message methods
  createMessage(messageData) {
    const message = {
      id: this.currentMessageId++,
      content: messageData.content,
      userId: messageData.userId,
      username: messageData.username,
      timestamp: new Date(),
      type: messageData.type || 'message'
    };
    this.messages.push(message);
    return message;
  }

  getMessages(limit = 50) {
    return this.messages.slice(-limit);
  }

  getAllMessages() {
    return this.messages;
  }

  // Typing indicators
  addTypingUser(userId) {
    this.typingUsers.add(userId);
  }

  removeTypingUser(userId) {
    this.typingUsers.delete(userId);
  }

  getTypingUsers() {
    return Array.from(this.typingUsers);
  }
}

export const storage = new MemStorage();
