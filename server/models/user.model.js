import { PutCommand, GetCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient as dynamoDB } from "../db/config/dynamodb.config.js";
import { v4 as uuidv4 } from "uuid";

const TableName = (process.env.DYNAMODB_TABLE_PREFIX || "chitchat_") + "Users";

const createUser = async (userData) => {
  const userId = uuidv4();
  const command = new PutCommand({
    TableName,
    Item: {
      userId,
      username: userData.username,
      fullName: userData.fullName,
      password: userData.password,
      gender: userData.gender,
      avatar: userData.avatar,
      createdAt: new Date().toISOString()
    },
    ConditionExpression: "attribute_not_exists(username)"
  });

  await dynamoDB.send(command);
  return { userId, ...userData };
};

const getUserByUsername = async (username) => {
  const command = new QueryCommand({
    TableName,
    IndexName: "UsernameIndex",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username
    }
  });

  const result = await dynamoDB.send(command);
  return result.Items[0];
};

const getUserById = async (userId) => {
  const command = new GetCommand({
    TableName,
    Key: { userId }
  });

  const result = await dynamoDB.send(command);
  return result.Item;
};

const getOtherUsers = async (currentUserId) => {
  const command = new ScanCommand({
    TableName,
    FilterExpression: "userId <> :currentUserId",
    ExpressionAttributeValues: {
      ":currentUserId": currentUserId
    }
  });

  const result = await dynamoDB.send(command);
  return result.Items;
};

export {
  createUser,
  getUserByUsername,
  getUserById,
  getOtherUsers
};