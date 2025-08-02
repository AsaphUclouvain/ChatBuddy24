import { io } from "socket.io-client";

const socket = io("https://3dff10e7f9df.ngrok-free.app", {
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