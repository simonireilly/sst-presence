import { createRoom, joinRoom } from "./index";

describe("room", () => {
  describe("createRoom", () => {
    it("creates a room", () => {
      // Arrange + Act
      const room = createRoom("secret-id", "connection-id");

      // Assert
      expect(room).toEqual(
        expect.objectContaining({
          id: "secret-id",
          members: expect.arrayContaining(["connection-id"]),
        })
      );
    });
  });

  describe("joinRoom", () => {
    it("joins an existing room with a member", () => {
      // Arrange + Act
      const room = joinRoom(
        {
          id: "secret-id",
          members: ["author"],
        },
        "connection-id"
      );

      // Assert
      expect(room).toEqual(
        expect.objectContaining({
          id: "secret-id",
          members: expect.arrayContaining(["connection-id", "author"]),
        })
      );
    });

    it.todo("user can rejoin the room");
  });

  describe("updateRoom", () => {
    it.todo("user can update own data");

    it.todo("user cannot update another users data");
  });
});
