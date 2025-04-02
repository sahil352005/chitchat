import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { docClient } from "../db/config/dynamodb.config.js";
import { TableSchemas } from "../db/schemas/table.schemas.js";

export const initializeDynamoDB = async () => {
  try {
    for (const [tableName, schema] of Object.entries(TableSchemas)) {
      try {
        await docClient.send(new CreateTableCommand(schema));
        console.log(`Created table: ${tableName}`);
      } catch (error) {
        if (error.name === 'ResourceInUseException') {
          console.log(`Table ${tableName} already exists`);
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error("Error initializing DynamoDB:", error);
    throw error;
  }
};