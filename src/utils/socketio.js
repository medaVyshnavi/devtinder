const socket = require("socket.io");
const Chat = require("../models/ChatSchema")

const initializeSocket = (httpServer) => {
  const io = socket(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // handle the events
    try {
      // { userId, targetUserId } values passed from the FE , any values can be sent.
      socket.on("joinChat", ({ userId, targetUserId }) => {
        // B_A OR A_B should give same so that both are connected to the same room ; use sort
        const roomId = [userId, targetUserId].sort().join("_");
        socket.join(roomId);
      });

      socket.on("sendMessage", async ({ firstName, userId, targetUserId, text: newMessage }) => {
        const roomId = [userId, targetUserId].sort().join("_");

        // save message to db. 
        // 1. update an existing chat
        // 2. create a new chat and save to db

        let chat = await Chat.findOne({
          participants : {$all : [ userId, targetUserId]}
        });

        if (!chat) {
           chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({ sender: userId, text: newMessage })
        await chat.save();
        io.to(roomId).emit("newMessage", { userId, newMessage });
      
      });

      socket.on("closeConnection", () => { });
    } catch (err) {
        console.log(err)
    }
  });
}

module.exports = initializeSocket