import { useEffect, useRef, useState } from "react";

// const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
// const SOCKET_SERVER_URL = "ws://localhost:5555";
// const io = require("socket.io-client");

// const useLiveMapInteraction = () => {
//     const socket = io(SOCKET_SERVER_URL, {
//         upgrade: true,
//         transports: ["websocket"]
//     })
//     const clientId = socket.io.engine.id

//     const [messages, setMessages] = useState([]); // Sent and received messages
//     const socketRef = useRef();
//     socket.on("connect", (connectData: any) => {
//         console.log({ connectData })
//         console.log({ socket })
//         console.log({ clientId })
//         socket.emit("joinRoom")
//     })

//     // from socket.send()
//     socket.on("message", (data: any) => {
//         console.log({ data })
//     })

//     socket.on("roomJoined", (params: any) => {
//         console.log("joined room", { params })
//     })
// }
//   useEffect(() => {
//     // Creates a WebSocket connection
//     socketRef.current = new Socket(SOCKET_SERVER_URL, {
//       query: { roomId },
//     });

//     // Listens for incoming messages
//     socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
//       const incomingMessage = {
//         ...message,
//         ownedByCurrentUser: message.senderId === socketRef.current.id,
//       };
//       setMessages((messages) => [...messages, incomingMessage]);
//     });

//     // Destroys the socket reference
//     // when the connection is closed
//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, [roomId]);

//   // Sends a message to the server that
//   // forwards it to all users in the same room
//   const sendMessage = (messageBody) => {
//     socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
//       body: messageBody,
//       senderId: socketRef.current.id,
//     });
//   };

//   return { messages, sendMessage };

export default {};