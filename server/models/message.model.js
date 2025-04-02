import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../db/config/dynamodb.config.js";
import { v4 as uuidv4 } from "uuid";

const TableName = "Messages";

export const createMessage = async (messageData) => {
  const messageId = uuidv4();
  const timestamp = new Date().toISOString();

  const command = new PutCommand({
    TableName,
    Item: {
      messageId,
      conversationId: `${messageData.senderId}_${messageData.receiverId}`,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      message: messageData.message,
      createdAt: timestamp
    }
  });

  await docClient.send(command);
  return {
    messageId,
    ...messageData,
    createdAt: timestamp
  };
};

export const getMessages = async (senderId, receiverId) => {
  const command = new QueryCommand({
    TableName,
    KeyConditionExpression: "conversationId = :convId",
    ExpressionAttributeValues: {
      ":convId": `${senderId}_${receiverId}`
    },
    ScanIndexForward: false
  });

  const result = await docClient.send(command);
  return result.Items;
};