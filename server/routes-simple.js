import { Server } from "socket.io";
import { storage } from "./storage-mem.js";

export function registerRoutes(app, httpServer) {
  // Initialize Socket.io with the existing HTTP server
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    path: "/socket.io/"
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user join
    socket.on('join', async (userData) => {
      try {
        let user = await storage.findUserByUsername(userData.username);
        
        if (!user) {
          user = await storage.createUser(userData);
        }

        // Add to active users
        storage.addActiveUser(user.id, socket.id);
        socket.userId = user.id;
        socket.username = user.username;

        // Join the general room
        socket.join('general');

        // Send recent messages to the new user
        const recentMessages = await storage.getMessages('general', 50);
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
        const message = await storage.createMessage({
          content: messageData.content,
          sender: socket.username,
          room: 'general'
        });

        // Broadcast message to all users in the room
        io.to('general').emit('new_message', message);

        console.log(`Message from ${socket.username}: ${message.content}`);
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', () => {
      if (socket.username) {
        socket.to('general').emit('user_typing', {
          username: socket.username
        });
      }
    });

    socket.on('stop_typing', () => {
      if (socket.username) {
        socket.to('general').emit('user_stop_typing', {
          username: socket.username
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        if (socket.userId) {
          storage.removeActiveUser(socket.userId);

          // Broadcast user left to others
          socket.to('general').emit('user_left', {
            username: socket.username,
            message: `${socket.username} left the chat`
          });

          // Broadcast updated user list
          io.to('general').emit('online_users', storage.getActiveUsers());

          console.log(`${socket.username} disconnected`);
        }
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });

  // REST API endpoints for basic operations
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Chat server is running' });
  });

  app.get('/api/messages', async (req, res) => {
    try {
      const messages = await storage.getMessages('general', 50);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.get('/api/users/online', (req, res) => {
    try {
      const onlineUsers = storage.getActiveUsers();
      res.json(onlineUsers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch online users' });
    }
  });

  return io;
}