import React, { createContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { MapTool } from './screens/tactics/components/interactive-map/MapTools';
import { addMarker, clearMarkers, MapMarker, moveCursor, setActiveTool } from './slices/mapInteractionSlice';
import { changeMap } from './slices/mapsApiSlice';
import { io } from "socket.io-client";

export const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
export const WS_BASE = 'wss://wot-data-server.herokuapp.com:5555';

const socket = io(WS_BASE, {
    upgrade: true,
    transports: ["websocket"]
})

// const sendMessage = (message: string) => {
//     const payload = {
//         // roomId: roomId,
//         // data: message
//     }
//     socket.emit("event://send-message", JSON.stringify(payload));
//     // dispatch(updateChatLog(payload));
// }

const WebSocketContext = createContext({ socket });

const WebSocketProvider = (props: any) => {
    const dispatch = useDispatch()
    const [value, setValue] = useState({ socket });
    useEffect(() => initSockets({ setValue, dispatch }), [value, setValue, dispatch]);

    return (
        <WebSocketContext.Provider value={value}>
            {props.children}
        </WebSocketContext.Provider>
    )
}
export default WebSocketProvider
export { WebSocketContext }

export const SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST"
export const UPDATE_CHAT_LOG = "UPDATE_CHAT_LOG"

// // index.ts
export const initSockets = ({ setValue, dispatch }: any) => {
    socketEvents({ setValue, dispatch });
    // setValue    ^ is passed on to be used by socketEvents
    // getQueueLength();
};

// // events.ts
export const socketEvents = ({ setValue, dispatch }: any) => {
    socket.on("connect", (connectData: any) => {
        // console.log({ connectData })
        // console.log({ socket })
    })

    socket.on('sendMessage', ({ message }: any) => {
        // console.log("sending message")
        setValue((state: any) => {
            console.log({ state })
            return { ...state, message }
        });
    });

    socket.on(NEW_CHAT_MESSAGE_EVENT, ({ message }: any) => {
        // console.log("sending message")
    })

    // from socket.send()
    socket.on("message", (data: any) => {
        // console.log({ data })
    })

    socket.on("cursorPositionChanged", (data: any) => {
        // console.log(`RECEIVED event *cursorPositionChanged* with data: ${data}`)
        dispatch(moveCursor(JSON.parse(data)))
    })

    socket.on("clearedMarkers", () => {
        dispatch(clearMarkers())
    })

    socket.on("markerAdded", (data: any) => {
        const marker = JSON.parse(data) as MapMarker
        console.log({ marker })
        dispatch(addMarker(marker))
    })

    socket.on("selectedToolChanged", (data: any) => {
        const mapTool = JSON.parse(data) as MapTool;
        console.log({ mapTool })
        dispatch(setActiveTool(mapTool))
    })

    socket.on("mapChanged", (mapName: string) => {
        console.log(mapName)
        // console.log("recieved *mapChanged* event: ", { mapName })
        dispatch(changeMap(JSON.parse(mapName)))
    })

    socket.on("333", ({ message }: any) => {
        // console.log("joined room", { message })
    })
    // socket.on('positionInLine', ({ positionInLine }: any) => {
    //     setValue((state: any) => { return { ...state, positionInLine } });
    // });
};

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

export function updateChatLog(update: any) {
    console.log('update chat log')
    return {
        type: UPDATE_CHAT_LOG,
        update
    }
}