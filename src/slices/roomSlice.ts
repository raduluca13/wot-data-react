import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchStatus, RootState } from ".";
// import { socket, WS_BASE } from "../WebSocketContext";
export const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
export const WS_BASE = 'http://127.0.0.1:4000';

interface RoomState {
    room: number,
    connectionStatus: FetchStatus,
    hasConnectionErrors: boolean,
    positionList: any[],
    usersInRoom: any[], // User[]
    username: any;
}

const initialState = {
    room: 0,
    connectionStatus: 'idle',
    hasConnectionErrors: false,
    usersInRoom: [],
    positionList: [],
    username: "username"
} as RoomState

export const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        sendMessage: (state: RoomState, action: PayloadAction<{ eventType: string, roomId: number, message: any }>) => {
            const { eventType, roomId, message } = action.payload;
            const payload = {
                roomId,
                message
            }
            // socket.emit(eventType, JSON.stringify(payload))
        }
    },
    extraReducers: {
        ['rooms/join/fulfilled']: (state, action) => {
            const { arg, requestId, requestStatus } = action.meta
            if (!!action.payload) {
                // state.room = action.payload.room;
                // state.positionList = action.payload.positionList;
                // state.username = false;
            }
        },
        ['rooms/join/rejected']: (state, action) => {
            const { arg, requestId, requestStatus } = action.meta
            if (requestStatus === "rejected") {
                state.hasConnectionErrors = true;
                state.connectionStatus = "failed";
            }
        },
        ['rooms/join/pending']: (state, action) => {
            const { arg, requestId, requestStatus } = action.meta
            if (requestStatus === "pending") {
                state.connectionStatus = "loading"
            }
        },
    }
});

export const joinRoomThunk = createAsyncThunk('rooms/join', async (roomId, thunkApi) => {
    // socket.emit("JOIN", JSON.stringify({
    //     roomId: 1
    // }))

    const response = await fetch(`${WS_BASE}/room/${roomId}`)
    const data = await response.json();

    return data;
})


export const roomStateSelector = (state: RootState) => state.roomState
export const roomSelector = createSelector([roomStateSelector], (state) => state.room)
export const username = createSelector([roomStateSelector], (state) => state.username)



export const { sendMessage } = roomSlice.actions
export default roomSlice.reducer;