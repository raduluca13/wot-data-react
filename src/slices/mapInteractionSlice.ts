import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Point } from '../screens/tactics/components/interactive-map/InteractiveMap';
import { ClanDetails } from '../screens/vehicles/types';

const MAP_STATE_STORAGE_KEY = 'mapState'

interface MapState {
    positionList: Point[]
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
        positionList: [] as Point[]
    } as MapState
}

const initialState = loadState() || createDefaultMapState()

export const mapInteractionSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        savePositionList: (state, action: PayloadAction<any>) => {
            const positionList = action.payload;
            state.positionList = positionList;
            //  roomSlice.actions.sendMessage({
            //     eventType: NEW_CHAT_MESSAGE_EVENT,
            //     roomId: 1,
            //     message: positionList
            // })
            saveMapState(state);
        },
    },
    extraReducers: {
        ['.../fulfilled']: (state, action: PayloadAction<ClanDetails>) => {
        },
        ['.../rejected']: (state, action) => {
        },
        ['.../pending']: (state, action) => {
        }
    }
});

export const mapInteractionStateSelector = (state: RootState) => state.mapInteractionState
export const pointListSelector = createSelector([mapInteractionStateSelector], (state) => { return state.positionList as Point[] })


export const { savePositionList } = mapInteractionSlice.actions;
export default mapInteractionSlice.reducer;