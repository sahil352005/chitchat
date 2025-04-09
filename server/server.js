import dotenv from "dotenv";
dotenv.config();

import { app, server } from "./socket/socket.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { initializeDynamoDB } from "./utilities/dynamodb.utility.js";

// Validate required environment variables
const requiredEnvVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'JWT_SECRET',
  'CLIENT_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize DynamoDB with error handling
try {
  await initializeDynamoDB();
  console.log('DynamoDB initialized successfully');
} catch (error) {
  console.error('Failed to initialize DynamoDB:', error);
  process.exit(1);
}

// Configure CORS with specific origins
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Cookie settings middleware
app.use((req, res, next) => {
  const originalCookie = res.cookie;
  res.cookie = function(name, value, options = {}) {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    };
    return originalCookie.call(this, name, value, { ...defaultOptions, ...options });
  };
  next();
});

const PORT = process.env.PORT || 5000;

// Routes with versioning
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
import { errorMiddleware } from "./middlewares/error.middlware.js";
app.use(errorMiddleware);

// Handle unhandled routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server with error handling
server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
}).on('error', (error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});