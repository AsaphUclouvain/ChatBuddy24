require("dotenv").config();
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT;
let users = {};
let userCount = 1;
const welcomeMessage = (usersConnected, userNumber) => {
    return (
    `
        Welcome to the Talk to Stranger room! 👋

        There are currently ${usersConnected} user/s connected.
        You identify as: <i>Stranger ${userNumber}</i>

        Please be respectful and kind to everyone here.
        Remember:
        - Follow the community rules at all times.
        - This room is only for users aged 18 and above.

        Enjoy your conversation and stay safe! 😊
    `
    )
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.emit("welcome message", welcomeMessage(Object.keys(users).length, Object.keys(users).length + 1));
    users[socket.id] = `Stranger ${userCount}`;
    socket.broadcast.emit("broadcast", `A new stranger just joined the chat, ${users[socket.id]}!`);
    userCount += 1;
    
    socket.on("chat message", (msg) => {
        io.emit('chat message', `${users[socket.id]}: ${msg}`);
    })

    socket.on("typing", () => {
        socket.broadcast.emit("userTyping", users[socket.id]);
    })

    socket.on('disconnect', () => {
        delete users[socket.id];
        userCount -= 1;
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})