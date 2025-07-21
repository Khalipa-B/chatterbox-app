# Real-Time Chat Application

## Overview

This is a modern real-time chat application built with React, Express, Socket.io, and MongoDB. The application demonstrates bidirectional communication between clients and server, implementing features like live messaging, user presence, persistent message storage, and real-time notifications.

## Recent Changes (January 21, 2025)

✓ Successfully resolved Socket.io connection issues and established bidirectional communication
✓ Converted server architecture from TypeScript to JavaScript as requested  
✓ Integrated MongoDB Atlas database with proper IP whitelist configuration
✓ Implemented persistent message and user storage with real-time synchronization
✓ Fixed server startup issues and static file serving configuration
✓ Chat application now fully functional with database persistence

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: Socket.io client for WebSocket connections

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Real-time Communication**: Socket.io server for WebSocket handling
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **Build Process**: ESBuild for server bundling

### Data Storage Solutions
- **Primary Database**: MongoDB Atlas with Mongoose ODM
- **Connection**: MongoDB Atlas cluster (chatterbox database)
- **Models**: User and Message schemas with proper indexing
- **Hybrid Storage**: Database persistence with in-memory active user tracking

### Authentication and Authorization
- **Session-based Authentication**: Express sessions stored in PostgreSQL
- **User Management**: Basic username/password system
- **Online Status Tracking**: Socket.io connection-based presence system

## Key Components

### Real-time Communication
- **Socket.io Integration**: Bidirectional WebSocket communication
- **Event Handling**: Custom React hook (`useSocket`) for managing socket connections
- **Connection Management**: Automatic reconnection and error handling
- **Message Broadcasting**: Real-time message delivery to all connected clients

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Comprehensive UI components from Shadcn/ui
- **Toast Notifications**: Real-time notifications for chat events
- **Dark/Light Mode**: CSS variable-based theming system

### Data Models
- **Users**: Username, password, online status, last seen timestamp
- **Messages**: Content, sender information, timestamps, message types
- **Rooms**: Support for multiple chat rooms (extendable architecture)

## Data Flow

### Message Flow
1. User types message in React component
2. Message sent via Socket.io to Express server
3. Server validates and stores message
4. Server broadcasts message to all connected clients
5. Clients receive and display message in real-time

### User Presence Flow
1. User connects via Socket.io
2. Server tracks connection in active users map
3. Online status broadcasted to all clients
4. Disconnection automatically updates presence

### Authentication Flow
1. User submits credentials via REST API
2. Server validates against PostgreSQL database
3. Session created and stored in database
4. Subsequent requests authenticated via session cookies

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **socket.io**: Real-time bidirectional communication
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@tanstack/react-query**: Server state management
- **express**: Web application framework

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type safety and developer experience
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Assets**: Static files served from built frontend

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **Session Configuration**: Automatic PostgreSQL session storage

### Hosting Requirements
- **Node.js Runtime**: ES modules support required
- **PostgreSQL Database**: Neon serverless or compatible
- **WebSocket Support**: Socket.io requires WebSocket capability
- **Static File Serving**: Express serves built React application

### Development Workflow
- **Dev Server**: `npm run dev` starts both frontend and backend
- **Database**: `npm run db:push` applies schema changes
- **Type Checking**: `npm run check` validates TypeScript
- **Hot Reload**: Vite HMR for frontend, tsx for backend restart