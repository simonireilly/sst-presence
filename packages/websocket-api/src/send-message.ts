import { APIGatewayProxyHandler } from "aws-lambda";
import { ApiGatewayManagementApi, dynamoDb } from './lib'
const TableName =  String(process.env.tableName)

export const main: APIGatewayProxyHandler = async (event) => {
  const messageData = event.body && JSON.parse(event.body).data;
  const { stage, domainName } = event.requestContext;

  // Get all the connections
  const connections = await dynamoDb
    .scan({ TableName, ProjectionExpression: "pk" })
    .promise();

  console.info('Connections found', { connections })

  const apiG = new ApiGatewayManagementApi({
    endpoint: `${domainName}/${stage}`,
  });

  const postToConnection = async function ({ pk }: any): Promise<void> {
    console.info('Sending to pk', { connections })
    try {
      // Send the message to the given client
      await apiG
        .postToConnection({ ConnectionId: pk, Data: messageData })
        .promise();
    } catch (e) {
      if (e.statusCode === 410) {
        // Remove stale connections
        await dynamoDb.delete({ TableName, Key: { pk } }).promise();
      }
    }
  };

  // Iterate through all the connections
  if(connections && connections.Items) {
    await Promise.all(connections.Items.map(postToConnection));
  }

  return { statusCode: 200, body: "Message sent" };
}