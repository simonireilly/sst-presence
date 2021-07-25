import { APIGatewayProxyHandler } from "aws-lambda";
import { findRoom, saveRoom } from "./lib";
import { createRoom, joinRoom, Room } from "./lib/room";

export const main: APIGatewayProxyHandler = async (event) => {
  let response = { statusCode: 500, body: "Unknown error" };

  const connectionId = event.requestContext?.connectionId;
  const roomId = event.queryStringParameters?.roomId;

  console.info("Request parameters", {
    roomId,
    connectionId,
  });

  if (!connectionId)
    return { statusCode: 422, body: "Missing parameter connectionId" };
  if (!roomId) return { statusCode: 422, body: "Missing parameter roomId" };

  // Find the room, if it does not exist, create it
  console.info("Looking for room");
  const room = await findRoom(roomId);
  console.info("Room found", room);

  if (room && room.Item) {
    console.info("Joining room");
    const roomItem: Room = {
      id: roomId,
      members: room.Item.members.values,
    };

    console.info("Adding member to room", { roomItem });
    const updatedRoom = joinRoom(roomItem, connectionId);
    try {
      console.info("Saving room");
      await saveRoom(roomId, updatedRoom);
      response = { statusCode: 200, body: "Connected" };
    } catch (e) {
      console.error(e);
      response = { statusCode: 404, body: "Could not join room" };
    }
  }

  if (room && !room.Item) {
    console.info("Creating room");
    const room = createRoom(roomId, connectionId);

    try {
      console.info("Saving room");
      await saveRoom(roomId, room);
      response = { statusCode: 200, body: "Connected" };
    } catch (e) {
      console.error(e);
      response = { statusCode: 404, body: "Could not create room" };
    }
  }

  console.info("Returning");
  return response;
};
