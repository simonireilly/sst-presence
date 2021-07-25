import { APIGatewayProxyHandler } from "aws-lambda";
import { disconnect } from './lib'

export const main: APIGatewayProxyHandler = async (event) => {
  let response = { statusCode: 500, body: "Unknown error" }

  const {
    requestContext: {
      connectionId
    }
  } = event

  if(connectionId) {
    try {
      await disconnect(connectionId)
      response = { statusCode: 200, body: "Disconnected" }
    } catch (e) {
      console.error(e)
      response = { statusCode: 404, body: "Connection not found" }
    }
  }

  return response
}