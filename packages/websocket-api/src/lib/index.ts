import * as AWS from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { Room } from "./room";

export const dynamoDb = new AWS.DynamoDB.DocumentClient();
export const ApiGatewayManagementApi = AWS.ApiGatewayManagementApi;

export const connect = async (
  connectionId: string
): Promise<
  PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>
> => {
  const params = {
    TableName: String(process.env.tableName),
    Item: {
      pk: connectionId,
    },
  };

  return dynamoDb.put(params).promise();
};

export const disconnect = async (
  connectionId: string
): Promise<
  PromiseResult<AWS.DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>
> => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      pk: connectionId,
    },
  };

  return dynamoDb.delete(params).promise();
};

export const findRoom = async (
  roomId: string
): Promise<
  PromiseResult<AWS.DynamoDB.DocumentClient.GetItemOutput, AWS.AWSError>
> => {
  const params = {
    TableName: String(process.env.tableName),
    Key: {
      pk: roomId,
    },
  };

  return dynamoDb.get(params).promise();
};

export const saveRoom = async (
  roomId: string,
  room: Room
): Promise<
  PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>
> => {
  const params = {
    TableName: String(process.env.tableName),
    Item: {
      pk: roomId,
      members: dynamoDb.createSet(room.members),
    },
  };

  return dynamoDb.put(params).promise();
};
