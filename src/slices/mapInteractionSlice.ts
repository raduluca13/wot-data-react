import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { MapTool } from '../screens/tactics/components/interactive-map/MapTools';

const MAP_STATE_STORAGE_KEY = 'mapState'

export enum MarkerType {
    CURSOR = "CURSOR",
    MEDIUM_TANK = "MEDIUM_TANK",
    HEAVY_TANK = "HEAVY_TANK",
    LIGHT_TANK = "LIGHT_TANK",
    SPG = "SPG",
    TD = "TD"
}

export type Point = {
    x: number,
    y: number
}

export type MapMarker = Point & {
    markerType: MarkerType
}

interface MapState {
    room: number,
    markers: MapMarker[],
    cursorPosition: Point,
    usersInRoom: any[], // User[]
    selectedTool: MapTool
}

const loadState = () => {
    const storage = localStorage.getItem(MAP_STATE_STORAGE_KEY)
    if (storage !== null) {
        return JSON.parse(storage) as MapState;
    }
}

export const saveMapState = (state: MapState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(MAP_STATE_STORAGE_KEY, serializedState);
    } catch {
        // ignore write errors
    }
};

const createDefaultMapState = () => {
    return {
        room: 0,
        markers: [],
        usersInRoom: [],
        cursorPosition: { x: 0, y: 0 },
        selectedTool: {
            cursorTool: true
        } as MapTool,
    } as unknown as MapState
}

const initialState = loadState() || createDefaultMapState()

export const mapInteractionSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        savePositionList: (state, action: PayloadAction<any>) => {
            const positionList = action.payload;
            //  roomSlice.actions.sendMessage({
            //     eventType: NEW_CHAT_MESSAGE_EVENT,
            //     roomId: 1,
            //     message: positionList
            // })
            saveMapState(state);
        },
        moveCursor: (state, action: PayloadAction<Point>) => {
            const point = action.payload
            if (Math.abs(state.cursorPosition.x - point.x) > 10 || Math.abs(state.cursorPosition.y - point.y) > 10) {
                state.cursorPosition = point
            }
        },
        addMarker: (state, action: PayloadAction<MapMarker>) => {
            state.markers.push(action.payload)
        },
        clearMarkers: (state) => {
            state.markers = [];
            state.cursorPosition = { x: 0, y: 0 } // TODO - better way?
        },
        setActiveTool: (state, action: PayloadAction<MapTool>) => {
            const tool = action.payload
            state.selectedTool = tool;
        },
    },
    extraReducers: {}
});

export const mapInteractionStateSelector = (state: RootState) => state.mapInteractionState
export const cursorPositionSelector = createSelector([mapInteractionStateSelector], (state) => state.cursorPosition)
export const selectedToolSelector = createSelector([mapInteractionStateSelector], (state) => state.selectedTool)
export const markersSelector = createSelector([mapInteractionStateSelector], (state) => state.markers)


export const { savePositionList, setActiveTool, moveCursor, addMarker, clearMarkers } = mapInteractionSlice.actions;
export default mapInteractionSlice.reducer;