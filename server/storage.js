import { connectDB } from "./db.js";
import { User, Message } from "./models.js";

export class MongoDBStorage {
  constructor() {
    this.activeUsers = new Map(); // socketId -> user mapping (in-memory for socket tracking)
    this.typingUsers = new Set(); // in-memory for typing indicators
    this.initDB();
  }

  async initDB() {
    try {
      await connectDB();
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
    }
  }

  // User methods
  async createUser(userData) {
    try {
      const user = new User({
        username: userData.username,
        isOnline: true,
        status: 'online',
        lastSeen: new Date(),
      });
      await user.save();
      return user.toObject();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findById(id).lean();
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by id:', error);
      return undefined;
    }
  }

  async getUserByUsername(username) {
    try {
      const user = await User.findOne({ username }).lean();
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getAllUsers() {
    try {
      return await User.find({}).lean();
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async updateUserStatus(userId, status) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          status,
          isOnline: status === 'online',
          lastSeen: new Date(),
        },
        { new: true }
      ).lean();
      return user;
    } catch (error) {
      console.error('Error updating user status:', error);
      return undefined;
    }
  }

  // Active users (socket connections) - kept in-memory for real-time tracking
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
  async createMessage(messageData) {
    try {
      const message = new Message({
        content: messageData.content,
        userId: messageData.userId,
        username: messageData.username,
        type: messageData.type || 'message',
      });
      await message.save();
      return message.toObject();
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async getMessages(limit = 50) {
    try {
      const messages = await Message.find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
      return messages.reverse(); // Show oldest first
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async getAllMessages() {
    try {
      return await Message.find({}).sort({ timestamp: 1 }).lean();
    } catch (error) {
      console.error('Error getting all messages:', error);
      return [];
    }
  }

  // Typing indicators - kept in-memory for real-time updates
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

export const storage = new MongoDBStorage();