import { createMessage, getMessages } from "../models/message.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import { getSocketId, io } from '../socket/socket.js';

export const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user.userId;
  const receiverId = req.params.receiverId;
  const message = req.body.message;

  if (!senderId || !receiverId || !message) {
    return next(new errorHandler("All fields are required", 400));
  }

  const newMessage = await createMessage({
    senderId,
    receiverId,
    message
  });

  // Socket.io notification
  const socketId = getSocketId(receiverId);
  io.to(socketId).emit("newMessage", newMessage);

  res.status(200).json({
    success: true,
    responseData: newMessage
  });
});

export const getMessageHistory = asyncHandler(async (req, res, next) => {
  const senderId = req.user.userId;
  const receiverId = req.params.otherParticipantId;

  if (!senderId || !receiverId) {
    return next(new errorHandler("All fields are required", 400));
  }

  const messages = await getMessages(senderId, receiverId);

  res.status(200).json({
    success: true,
    responseData: { messages }
  });
});