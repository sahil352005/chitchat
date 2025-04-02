import { PutCommand, GetCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../db/dynamodb.config.js";
import { v4 as uuidv4 } from "uuid";

const TableName = "Users";

export const createUser = async (userData) => {
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

  await docClient.send(command);
  return { userId, ...userData };
};

export const getUserByUsername = async (username) => {
  const command = new QueryCommand({
    TableName,
    IndexName: "UsernameIndex",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username
    }
  });

  const result = await docClient.send(command);
  return result.Items[0];
};

export const getUserById = async (userId) => {
  const command = new GetCommand({
    TableName,
    Key: { userId }
  });

  const result = await docClient.send(command);
  return result.Item;
};

export const getOtherUsers = async (currentUserId) => {
  const command = new ScanCommand({
    TableName,
    FilterExpression: "userId <> :currentUserId",
    ExpressionAttributeValues: {
      ":currentUserId": currentUserId
    }
  });

  const result = await docClient.send(command);
  return result.Items;
};