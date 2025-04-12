import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import dynamoDB from "../db/dynamodb.config.js";
import { v4 as uuidv4 } from "uuid";

const TableName = process.env.DYNAMODB_TABLE_PREFIX + "Messages";

export const createMessage = async (messageData) => {
  const messageId = uuidv4();
  const command = new PutCommand({
    TableName,
    Item: {
      messageId,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      message: messageData.message,
      createdAt: new Date().toISOString(),
    },
  });

  await dynamoDB.send(command);
  return { messageId, ...messageData };
};

export const getMessagesByUsers = async (userId1, userId2) => {
  // Get messages where user1 is sender and user2 is receiver
  const command1 = new QueryCommand({
    TableName,
    IndexName: "SenderReceiverIndex",
    KeyConditionExpression: "senderId = :senderId AND receiverId = :receiverId",
    ExpressionAttributeValues: {
      ":senderId": userId1,
      ":receiverId": userId2,
    },
  });

  // Get messages where user2 is sender and user1 is receiver
  const command2 = new QueryCommand({
    TableName,
    IndexName: "SenderReceiverIndex",
    KeyConditionExpression: "senderId = :senderId AND receiverId = :receiverId",
    ExpressionAttributeValues: {
      ":senderId": userId2,
      ":receiverId": userId1,
    },
  });

  const [result1, result2] = await Promise.all([
    dynamoDB.send(command1),
    dynamoDB.send(command2),
  ]);

  // Combine and sort messages by timestamp
  const messages = [...(result1.Items || []), ...(result2.Items || [])];
  messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return messages;
};