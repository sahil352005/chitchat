import { createMessage, getMessagesByUsers } from "../models/message.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import { getSocketId, io } from '../socket/socket.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.userId;

    // Create message in database
    const newMessage = await createMessage({
      senderId,
      receiverId,
      message,
    });

    // Get receiver's socket ID
    const receiverSocketId = getSocketId(receiverId);

    // If receiver is online, emit message
    if (receiverSocketId) {
      req.app.get("io").to(receiverSocketId).emit("newMessage", {
        senderId,
        message,
        createdAt: newMessage.createdAt,
      });
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    // Get messages between current user and selected user
    const messages = await getMessagesByUsers(currentUserId, userId);

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

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