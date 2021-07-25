export interface Room {
  id: string;
  members: string[];
}

/**
 * Create a room, specifying a globally unique ID for the room
 *
 * @param id
 * @param item
 * @returns
 */
export const createRoom = (roomId: string, author: string): Room => {
  return {
    id: roomId,
    members: [author],
  };
};

/**
 * Join an existing room using the roomId
 *
 * @param roomId
 * @param member
 * @returns
 */
export const joinRoom = (room: Room, member: string): Room => {
  return {
    ...room,
    members: [...room.members, member],
  };
};
