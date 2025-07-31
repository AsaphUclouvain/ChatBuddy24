require("dotenv").config();
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const geoip = require("geoip-country");
const morgan = require("morgan");
const cors = require("cors");
const reportRoute = require("../routes/report");
const connectDB = require("../utils/db_connect");
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin:['http://localhost:5173'], 
    credentials: true
}));
app.use('/tts/chats', reportRoute);

(async () => {
    const db = await connectDB();
    const queueCreated = await db.exists("userQueue");

    if (!queueCreated) {
        await db.rPush("userQueue", "decoy");
        await db.lPop("userQueue");
    };

    io.on('connection', (socket) => {
        // const xForwardedFor = socket.handshake.headers["x-forwarded-for"];
        // const ipAddress = xForwardedFor ? xForwardedFor.split(",")[0].trim() : socket.handshake.address;
        // const country = geoip.lookup(ipAddress);
        socket.on("user details", async (data) => {
            socket.username = data.username;
            socket.gender = data.gender;

            const queueLength = await db.lLen("userQueue");
            if (queueLength > 0) {
                const partnerUserData = await db.lPop("userQueue");
                const partnerUser = JSON.parse(partnerUserData);
                const partnerStranger = io.sockets.sockets.get(partnerUser.socketId);
                if (partnerStranger) {
                    const roomId = `room_${socket.id}_${partnerStranger.id}`;

                    socket.join(roomId);
                    partnerStranger.join(roomId);

                    socket.room = roomId;
                    partnerStranger.room = roomId;

                    socket.emit("matched", {roomId: roomId, username: socket.username, gender: socket.gender, partnerUsername: partnerStranger.username, partnerGender: partnerStranger.gender});
                    partnerStranger.emit("matched", {roomId: roomId, username: partnerStranger.username, gender: partnerStranger.gender, partnerUsername: socket.username, partnerGender: socket.gender});
                } else {
                    console.log("Problem, no stranger found!");
                }
            } else {
                const user = {
                    socketId: socket.id,
                    username: socket.username,
                    gender: socket.gender
                };
                await db.rPush("userQueue", JSON.stringify(user));
            }
        });
        const ipAddress = socket.handshake.address;
        console.log(ipAddress, "This is the client ipaddress");

        socket.on("chat message", (msg) => {
            socket.to(socket.room).emit("chat message", `${socket.username}: ${msg}`)
            socket.emit("chat message", `You: ${msg}`);
        });

        socket.on("typing", () => {
            socket.to(socket.room).emit("userTyping", {user: "strangers"});
        });

        socket.on("disconnect", async () => {
            const user = {
                    socketId: socket.id,
                    username: socket.username,
                    gender: socket.gender
                };
            const queuePresence = await db.lPos("userQueue", JSON.stringify(user));
            if (queuePresence !== -1) {
                await db.lRem("userQueue", 0, JSON.stringify(user));
            }

            if (socket.room) {
                socket.to(socket.room).emit("strangerDisconnected");
            };
            socket.room = "";
        });
    });

    server.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
})();