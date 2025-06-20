const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("./models/chat");
const ConnectionRequest = require("./models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, id }) => {
      const roomId = getSecretRoomId(userId, id);
      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, id, newMsg }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, id);
          console.log(firstName + " " + newMsg);

          // TODO: Check if userId & targetUserId are friends

          let chat = await Chat.findOne({
            participants: { $all: [userId, id] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, id],
              messages: [],
            });
          }
          console.log(newMsg)
          chat.messages.push({
            sender: userId,
            text: newMsg
          });

          await chat.save();
          io.to(roomId).emit("msgRecieved", { firstName, newMsg });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;