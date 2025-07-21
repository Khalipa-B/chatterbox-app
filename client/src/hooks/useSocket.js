import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useToast } from "@/hooks/use-toast";

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  const { toast } = useToast();
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io({
      transports: ['websocket', 'polling']
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the chat server",
        variant: "destructive"
      });
    });

    // Message events
    newSocket.on('message_history', (messageHistory) => {
      setMessages(messageHistory);
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      
      // Show browser notification if page is not focused
      if (document.hidden && message.username !== currentUser?.username) {
        if (Notification.permission === 'granted') {
          new Notification(`New message from ${message.username}`, {
            body: message.content,
            icon: '/favicon.ico'
          });
        }
      }
    });

    // User events
    newSocket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('user_joined', (data) => {
      toast({
        title: "User Joined",
        description: data.message
      });
      
      // Add system message
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: data.message,
        type: 'system',
        timestamp: new Date()
      }]);
    });

    newSocket.on('user_left', (data) => {
      toast({
        title: "User Left",
        description: data.message
      });
      
      // Add system message
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: data.message,
        type: 'system',
        timestamp: new Date()
      }]);
    });

    // Typing events
    newSocket.on('user_typing', (data) => {
      setTypingUsers(prev => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username];
        }
        return prev;
      });
    });

    newSocket.on('user_stop_typing', (data) => {
      setTypingUsers(prev => prev.filter(username => username !== data.username));
    });

    // Error handling
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    });

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      newSocket.close();
    };
  }, []);

  const joinChat = useCallback((username) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        reject(new Error('Socket not connected'));
        return;
      }

      const userData = { username };
      setCurrentUser(userData);
      
      socketRef.current.emit('join', userData);
      
      // Wait for successful join
      const timeout = setTimeout(() => {
        reject(new Error('Join timeout'));
      }, 5000);

      const handleUserData = (users) => {
        clearTimeout(timeout);
        const user = users.find(u => u.username === username);
        if (user) {
          setCurrentUser(user);
          resolve(user);
        }
      };

      socketRef.current.once('online_users', handleUserData);
    });
  }, []);

  const sendMessage = useCallback((content) => {
    if (socketRef.current && content.trim()) {
      socketRef.current.emit('send_message', { content });
    }
  }, []);

  const startTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('typing');
    }
  }, []);

  const stopTyping = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('stop_typing');
    }
  }, []);

  return {
    socket,
    isConnected,
    messages,
    onlineUsers,
    typingUsers,
    currentUser,
    joinChat,
    sendMessage,
    startTyping,
    stopTyping
  };
}
