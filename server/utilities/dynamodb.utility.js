import { CreateTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import dynamoDB from "../db/dynamodb.config.js";

const UsersTableName = process.env.DYNAMODB_TABLE_PREFIX + "Users";
const MessagesTableName = process.env.DYNAMODB_TABLE_PREFIX + "Messages";

const createUsersTable = async () => {
  const command = new CreateTableCommand({
    TableName: UsersTableName,
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "username", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "UsernameIndex",
        KeySchema: [
          { AttributeName: "username", KeyType: "HASH" },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  });

  await dynamoDB.send(command);
  console.log(`Table ${UsersTableName} created successfully`);
};

const createMessagesTable = async () => {
  const command = new CreateTableCommand({
    TableName: MessagesTableName,
    KeySchema: [
      { AttributeName: "messageId", KeyType: "HASH" }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: "messageId", AttributeType: "S" },
      { AttributeName: "senderId", AttributeType: "S" },
      { AttributeName: "receiverId", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "SenderReceiverIndex",
        KeySchema: [
          { AttributeName: "senderId", KeyType: "HASH" },
          { AttributeName: "receiverId", KeyType: "RANGE" },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  });

  await dynamoDB.send(command);
  console.log(`Table ${MessagesTableName} created successfully`);
};

export const initializeDynamoDB = async () => {
  try {
    // Check and create Users table
    try {
      await dynamoDB.send(new DescribeTableCommand({ TableName: UsersTableName }));
      console.log(`Table ${UsersTableName} already exists`);
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        await createUsersTable();
      } else {
        throw error;
      }
    }

    // Check and create Messages table
    try {
      await dynamoDB.send(new DescribeTableCommand({ TableName: MessagesTableName }));
      console.log(`Table ${MessagesTableName} already exists`);
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        await createMessagesTable();
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error initializing DynamoDB:", error);
    throw error;
  }
};