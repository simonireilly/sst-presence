import { APIGatewayProxyHandler } from "aws-lambda";
import { connect } from './lib'

export const main: APIGatewayProxyHandler = async (event) => {
  let response = { statusCode: 500, body: "Unknown error" }

  const {
    requestContext: {
      connectionId
    }
  } = event

  if(connectionId) {
    try {
      await connect(connectionId)
      response = { statusCode: 200, body: "Connected" }
    } catch (e) {
      console.error(e)
      response = { statusCode: 404, body: "Connection not found" }
    }
  }

  return response
}