require("dotenv").config();
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT;
const welcomeMessage = (strangerUser, strangerGender, strangerCountry) => {
    return (
    `
        Welcome to the Talk to Stranger room! 👋

        Please be respectful and kind to everyone here.

        Remember:
        - Follow the community rules at all times.
        - This room is only for users aged 18 and above.

        Enjoy your conversation and stay safe! 😊

        You have been connected with ${strangerUser}, they are a ${strangerGender} and from ${strangerCountry}.
    `
    )
}

let users = [];

io.on('connection', (socket) => {
    console.log("user connected");
    socket.on("user details", (data) => {
        socket.username = data.username;
        socket.gender = data.gender;
        console.log(socket.username, socket.gender);

        if (users.length > 0) {
            const partnerStranger = users.shift();
            const roomId = `room_${socket.id}_${partnerStranger.id}`;

            socket.join(roomId);
            partnerStranger.join(roomId);

            socket.room = roomId;
            partnerStranger.room = roomId;

            socket.emit("matched", roomId);
            partnerStranger.emit("matched", roomId);

        } else {
            users.push(socket);
        }
    })

    socket.on("chat message", (msg) => {
        socket.to(socket.room).emit("chat message", `${socket.username}: ${msg}`)
        socket.emit("chat message", `You: ${msg}`);
    })

    socket.on("typing", () => {
        socket.to(socket.room).emit("userTyping", {user: "strangers"});
    })

})

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})