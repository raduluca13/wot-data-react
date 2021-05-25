import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { FetchStatus, RootState } from ".";
import CONFIG from "../api/config";
import { VehicleResponse } from "../screens/vehicles/types";
import { buildParamStr } from "../utils/url/urlUtils";

const TANKS_API = "https://api.worldoftanks.eu/wot/encyclopedia/vehicles/"

export const VEHICLES_API_STATE_STORAGE_KEY = 'mapsApiState';

interface TanksState {
    tanksFetchStatus: FetchStatus,
    tanksFetchError: any,
    tanks: VehicleResponse,
}

const createDefaultTanksState = () => {
    return {
        tanksFetchStatus: 'idle',
        tanksFetchError: null,
        tanks: [],
    } as TanksState;
}
const initialState: TanksState = createDefaultTanksState();

const buildTanksQueryUrl: (url: string, params: any) => string = (url, params: any) => {
    const queryParamStr = buildParamStr(params);
    return `${url}?application_id=${CONFIG.APPLICATION_ID}&${queryParamStr}`;
}


export const fetchTanksThunk = createAsyncThunk(
    'tanks/fetchTanks',
    async (params: { vehicleIds?: [], tier?: number } = { tier: 10 }) => {
        const response: Response = await fetch(buildTanksQueryUrl(TANKS_API, params));
        const json = await response.json();
        return json.data;
    }
)

export const tanksSlice = createSlice({
    name: 'tactics',
    initialState,
    reducers: {
    },
    extraReducers: {
        ['tanks/fetchTanks/pending']: (state: TanksState, action) => {
            state.tanksFetchStatus = 'loading'
        },
        ['tanks/fetchTanks/rejected']: (state: TanksState, action) => {
            state.tanksFetchStatus = 'failed'
            state.tanksFetchError = action.error.message
        },
        ['tanks/fetchTanks/fulfilled']: (state: TanksState, action) => {
            state.tanksFetchStatus = 'succeeded'
            const payload = action.payload as VehicleResponse;
            state.tanks = payload;
        }
    }
});

export default tanksSlice.reducer;

export const { } = tanksSlice.actions

export const tanksStateSelector = (state: RootState) => state.tanksState;
export const tanksFetchSelector = createSelector(
    [tanksStateSelector],
    (tanksState) => {
        return {
            tanksFetchStatus: tanksState.tanksFetchStatus,
            tanksFetchErrors: tanksState.tanksFetchError,
            tanks: tanksState.tanks as VehicleResponse
        }
    }
)