// import React, { createContext, useEffect, useState } from 'react'
// import io from 'socket.io-client';
// import { NEW_CHAT_MESSAGE_EVENT } from './slices/roomSlice';

// export const WS_BASE = 'http://127.0.0.1:4000';
// export const socket = io.connect(WS_BASE, { query: { roomId: 1 } });

// const sendMessage = (message: string) => {
//     const payload = {
//         // roomId: roomId,
//         data: message
//     }
//     socket.emit("event://send-message", JSON.stringify(payload));
//     // dispatch(updateChatLog(payload));
// }

// const WebSocketContext = createContext({ socket });
// const WebSocketProvider = (props: any) => {
//     const [value, setValue] = useState({ socket });
//     useEffect(() => initSockets({ setValue }), [value, setValue]);

//     return (
//         <WebSocketContext.Provider value={value}>
//             {props.children}
//         </WebSocketContext.Provider>
//     )
// }
// export default WebSocketProvider
// export { WebSocketContext }

// export const SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST"
// export const UPDATE_CHAT_LOG = "UPDATE_CHAT_LOG"

// // index.ts
// export const initSockets = ({ setValue }: any) => {
//     socketEvents({ setValue });
//     // setValue    ^ is passed on to be used by socketEvents
//     // getQueueLength();
// };

// // events.ts
// export const socketEvents = ({ setValue }: any) => {
//     socket.on('sendMessage', ({ message }: any) => {
//         console.log("sending message")
//         setValue((state: any) => {
//             console.log({ state })
//             return { ...state, message }
//         });
//     });

//     socket.on("1", ({ message }: any) => {
//         console.log("sending message")
//     })
//     socket.on(NEW_CHAT_MESSAGE_EVENT, ({ message }: any) => {
//         console.log("sending message")
//     })
//     socket.on("ROOM", ({ message }: any) => {
//         console.log("sending message")
//     })
//     // socket.on('positionInLine', ({ positionInLine }: any) => {
//     //     setValue((state: any) => { return { ...state, positionInLine } });
//     // });
// };

// // emit.ts
// export const addClientToQueue = () => {
//     socket.emit('addClientIdToQueue');
// };
// export const getQueueLength = () => {
//     socket.emit('queueLengthToSocket');
// };
// export const removeUserFromQueue = () => {
//     socket.emit('removeUserFromQueue');
// };


// // import { WS_BASE } from './config';
// // import { updateChatLog } from './actions';

// // export function updateChatLog(update: any) {
// //     console.log('update chat log')
// //     return {
// //         type: UPDATE_CHAT_LOG,
// //         update
// //     }
// // }

export default {}