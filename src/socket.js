// src/socket.js
import { io } from "socket.io-client";

const apiUrl =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

console.log("📡 Connecting to:", apiUrl);

const socket = io(apiUrl, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
