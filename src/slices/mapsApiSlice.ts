import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchStatus, RootState } from ".";
import APPLICATION_ID from "../api/config";
import { WoTMap } from "../store/types/interfaces/WoTMap.interface";
import { buildParamStr } from "../utils/url/urlUtils";

const MAP_API = 'https://api.worldoftanks.ru/wot/encyclopedia/arenas/'
const MAP_IMAGES_API = "https://stratsketch.com/maps/wot/thumb/"

export const MAPS_API_STATE_STORAGE_KEY = 'mapsApiState';

interface MapsApiState {
    mapFetchError: any,
    mapFetchStatus: FetchStatus,
    maps: WoTMap[],
    selectedMap: WoTMap
}

const loadState = () => {
    const storage = localStorage.getItem(MAPS_API_STATE_STORAGE_KEY)
    if (storage !== null) {
        return JSON.parse(storage) as MapsApiState;
    }
}

const saveState = (state: MapsApiState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(MAPS_API_STATE_STORAGE_KEY, serializedState);
    } catch {
        // ignore write errors
    }
};

const createDefaultMapsApiState = () => {
    return {
        mapFetchStatus: 'idle',
        mapFetchError: null,
        maps: [{ arena_id: "NONE", name_i18n: "NONE" }] as WoTMap[],
        selectedMap: { arena_id: "NONE", name_i18n: "NONE" } as WoTMap
    } as MapsApiState;
}
const initialState: MapsApiState = loadState() || createDefaultMapsApiState();

const buildMapsQueryUrl: (url: string, params: any) => string = (url, params: any) => {
    const queryParamStr = buildParamStr(params);
    return `${url}?application_id=${APPLICATION_ID}&${queryParamStr}`;
}
const url = buildMapsQueryUrl(MAP_API, { language: "en" })

export const fetchMapsThunk = createAsyncThunk('maps/fetchMaps', async () => {
    const response: Response = await fetch(url);
    const json = await response.json();
    return json.data;
})

export const mapsApiSlice = createSlice({
    name: 'tactics',
    initialState,
    reducers: {
        changeMap: (state, action: PayloadAction<string>) => {
            const mapId = action.payload
            const mapIndex = state.maps.findIndex((map: WoTMap) => {
                return map.name_i18n === mapId
            })

            if (mapIndex !== -1) {
                state.selectedMap = { ...state.maps[mapIndex] }
            }
        },
    },
    extraReducers: {
        ['maps/fetchMaps/pending']: (state: MapsApiState, action) => {
            state.mapFetchStatus = 'loading'
        },
        ['maps/fetchMaps/rejected']: (state: MapsApiState, action) => {
            state.mapFetchStatus = 'failed'
            state.mapFetchError = action.error.message
        },
        ['maps/fetchMaps/fulfilled']: (state: MapsApiState, action) => {
            state.mapFetchStatus = 'succeeded'
            const payload = action.payload;
            Object.keys(payload).forEach(key => state.maps.push(payload[key]));
        }
    }
});

export default mapsApiSlice.reducer;

export const { changeMap } = mapsApiSlice.actions

export const mapsApiStateSelector = (state: RootState) => state.mapsApiState;
export const selectedInteractiveMapSelector = createSelector([mapsApiStateSelector], (state) => state.selectedMap)
