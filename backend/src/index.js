require("dotenv").config();
require('../config/passport');
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const geoip = require("geoip-country");
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const cors = require("cors");
const reportRoute = require("../routes/report");
const connectDB = require("../utils/db_connect");
const extractIp = require('../utils/extract_ip');
const loginRoute = require('../routes/support_login');
const bannerRoute = require('../routes/banner');
const {encrypt, decrypt} = require('../utils/encryption')
const {checkBlacklisted, limiter} = require('../middlewares/sec_measures');

const app = express();
const PORT = process.env.PORT;

//app.set('trust proxy', true);
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SIGNING));//for cookie signing
app.use(limiter);
app.use(express.json());
app.use(cors({
    origin:['http://localhost:5173', 'https://3dff10e7f9df.ngrok-free.app'], 
    credentials: true
}));
app.use('/tts/chats', reportRoute);
app.use('/support', loginRoute);
app.use('/support', bannerRoute);

const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {},

    cors: {
        origin: ["http://localhost:5173", "https://3dff10e7f9df.ngrok-free.app"],
        methods: ["GET", "POST"]
    }
});

io.use(checkBlacklisted);

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

        socket.onAny(async ()=>{
            const client = await connectDB();
            const ipAddr = decrypt(socket.ipInfo);

            if (await client.get(`banned:${ipAddr}`)){
                socket.emit('');
                socket.disconnect(true); 
            }
        });

        socket.on("user details", async (data) => {
            socket.username = data.username;
            socket.gender = data.gender;
            socket.ipInfo  = encrypt(extractIp(socket));

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
                    gender: socket.gender,
                    ipInfo:socket.ipInfo
                };
                await db.rPush("userQueue", JSON.stringify(user));
            }
        });


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
                    gender: socket.gender,
                    ipInfo:socket.ipInfo
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