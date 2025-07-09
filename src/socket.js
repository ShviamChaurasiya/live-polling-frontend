import { io } from "socket.io-client";

// Use environment variable or fallback to local
const apiUrl =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const socket = io(apiUrl, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
