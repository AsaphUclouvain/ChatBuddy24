import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  transports: ["websocket"],
  withCredentials: true
});

socket.on("connect", () => {
    console.log("Connected to socket server!");
});

socket.on("connect_error", (err) => {
    console.error("❌ Connection failed:", err.message);
}); 

export default socket;