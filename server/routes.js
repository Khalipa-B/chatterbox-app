import { createServer } from "http";
import { Server } from "socket.io";
import { storage } from "./storage.js";

export async function registerRoutes(app) {
  const httpServer = createServer(app);
  
  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user authentication/join
    socket.on('join', async (userData) => {
      try {
        let user = await storage.getUserByUsername(userData.username);
        
        if (!user) {
          user = await storage.createUser(userData);
        } else {
          user = await storage.updateUserStatus(user._id, 'online');
        }

        // Add to active users
        storage.addActiveUser(socket.id, user);
        socket.userId = user._id;
        socket.username = user.username;

        // Join the general room
        socket.join('general');

        // Send recent messages to the new user
        const recentMessages = await storage.getMessages(50);
        socket.emit('message_history', recentMessages);

        // Send current online users
        const onlineUsers = storage.getActiveUsers();
        socket.emit('online_users', onlineUsers);

        // Broadcast user joined to others
        socket.to('general').emit('user_joined', {
          user: user,
          message: `${user.username} joined the chat`
        });

        // Broadcast updated user list
        io.to('general').emit('online_users', storage.getActiveUsers());

        console.log(`${user.username} joined the chat`);
      } catch (error) {
        console.error('Error handling join:', error);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Handle new messages
    socket.on('send_message', async (messageData) => {
      try {
        const user = storage.getUserBySocketId(socket.id);
        if (!user) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        const message = await storage.createMessage({
          content: messageData.content,
          userId: user._id,
          username: user.username,
          type: 'message'
        });

        // Broadcast message to all users in the room
        io.to('general').emit('new_message', message);

        console.log(`Message from ${user.username}: ${message.content}`);
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', () => {
      const user = storage.getUserBySocketId(socket.id);
      if (user) {
        storage.addTypingUser(user._id);
        socket.to('general').emit('user_typing', {
          userId: user._id,
          username: user.username
        });
      }
    });

    socket.on('stop_typing', () => {
      const user = storage.getUserBySocketId(socket.id);
      if (user) {
        storage.removeTypingUser(user._id);
        socket.to('general').emit('user_stop_typing', {
          userId: user._id,
          username: user.username
        });
      }
    });

    // Handle user status updates
    socket.on('update_status', async (status) => {
      const user = storage.getUserBySocketId(socket.id);
      if (user) {
        await storage.updateUserStatus(user._id, status);
        const updatedUser = await storage.getUserById(user._id);
        io.to('general').emit('user_status_update', updatedUser);
        io.to('general').emit('online_users', storage.getActiveUsers());
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        const user = storage.removeActiveUser(socket.id);
        
        if (user) {
          // Update user status to offline
          await storage.updateUserStatus(user._id, 'offline');
          storage.removeTypingUser(user._id);

          // Broadcast user left to others
          socket.to('general').emit('user_left', {
            user: user,
            message: `${user.username} left the chat`
          });

          // Broadcast updated user list
          io.to('general').emit('online_users', storage.getActiveUsers());

          console.log(`${user.username} disconnected`);
        }
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });

  // REST API endpoints for basic operations
  app.get('/api/messages', (req, res) => {
    try {
      const messages = storage.getMessages(50);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.get('/api/users', (req, res) => {
    try {
      const users = storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  return httpServer;
}