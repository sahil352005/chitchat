export const TableSchemas = {
  Users: {
    TableName: "Users",
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "username", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "UsernameIndex",
        KeySchema: [
          { AttributeName: "username", KeyType: "HASH" }
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    }
  },
  Messages: {
    TableName: "Messages",
    KeySchema: [
      { AttributeName: "conversationId", KeyType: "HASH" },
      { AttributeName: "messageId", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
      { AttributeName: "conversationId", AttributeType: "S" },
      { AttributeName: "messageId", AttributeType: "S" },
      { AttributeName: "senderId", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "SenderIndex",
        KeySchema: [
          { AttributeName: "senderId", KeyType: "HASH" },
          { AttributeName: "messageId", KeyType: "RANGE" }
        ],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    }
  }
};