import * as AWS from 'aws-sdk'

export const dynamoDb = new AWS.DynamoDB.DocumentClient();
export const ApiGatewayManagementApi = AWS.ApiGatewayManagementApi

export const connect = async (connectionId: string) => {
  const params = {
    TableName: String(process.env.tableName),
    Item: {
      pk: connectionId,
    },
  };

  await dynamoDb.put(params).promise();
}

export const disconnect = async (connectionId: string) => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      pk: connectionId,
    },
  };

  await dynamoDb.delete(params).promise();
}