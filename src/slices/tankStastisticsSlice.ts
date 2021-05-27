import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchStatus, RootState } from ".";
import CONFIG from "../api/config";
import { TankStatistics, User, VehicleResponse } from "../screens/vehicles/types";
import { buildParamStr } from "../utils/url/urlUtils";

const TANKS_API = "https://api.worldoftanks.eu/wot/encyclopedia/vehicles/"
const TANKS_STATISTICS_URL = "https://api.worldoftanks.eu/wot/tanks/stats/"

export const VEHICLES_API_STATE_STORAGE_KEY = 'mapsApiState';


export interface PlayerTankStatistics {
    player: User,
    tankStatisticsFetchStatus: FetchStatus,
    tankStatisticsFetchError: any,
    tankStatistics?: TankStatistics[],
}


interface TankStatisticsState {
    playerTankStatistics: PlayerTankStatistics[]
}

interface PlayerTankStatisticsQuery {
    tank_id?: number,
    account_id: number
}

const createDefaultTankStatisticsState = () => {
    return {
        playerTankStatistics: []
    } as TankStatisticsState;
}
const initialState: TankStatisticsState = createDefaultTankStatisticsState();

const buildTanksQueryUrl: (url: string, params: any) => string = (url, params: any) => {
    const queryParamStr = buildParamStr(params);
    return `${url}?application_id=${CONFIG.APPLICATION_ID}&${queryParamStr}`;
}

export const fetchTankStatisticsByPlayerThunk = createAsyncThunk(
    'tanks/fetchTankStatistics',
    async (params: PlayerTankStatisticsQuery) => {
        const response: Response = await fetch(buildTanksQueryUrl(TANKS_STATISTICS_URL, params));
        const json = await response.json();
        return json.data[params.account_id];
    }
)


export const tankStatisticsSlice = createSlice({
    name: 'tactics',
    initialState,
    reducers: {
        addPlayerTankStatistics: (state, action: PayloadAction<PlayerTankStatistics>) => {
            const playerTankStatistics = action.payload;
            state.playerTankStatistics.push({ ...playerTankStatistics })
        }
    },
    extraReducers: {
        ['tanks/fetchTankStatistics/pending']: (state: TankStatisticsState, action) => {
            const playerTankStatisticsIndex = state.playerTankStatistics.findIndex(playerTankStatistics => playerTankStatistics.player.account_id === action.meta.arg.account_id)
            state.playerTankStatistics[playerTankStatisticsIndex].tankStatisticsFetchStatus = 'loading'
        },
        ['tanks/fetchTankStatistics/rejected']: (state: TankStatisticsState, action) => {
            const playerTankStatisticsIndex = state.playerTankStatistics.findIndex(playerTankStatistics => playerTankStatistics.player.account_id === action.meta.arg.account_id)
            state.playerTankStatistics[playerTankStatisticsIndex].tankStatisticsFetchStatus = 'failed'
            state.playerTankStatistics[playerTankStatisticsIndex].tankStatisticsFetchError = true
        },
        ['tanks/fetchTankStatistics/fulfilled']: (state: TankStatisticsState, action) => {
            const playerTankStatisticsIndex = state.playerTankStatistics.findIndex(playerTankStatistics => playerTankStatistics.player.account_id === action.meta.arg.account_id)
            state.playerTankStatistics[playerTankStatisticsIndex].tankStatisticsFetchStatus = 'succeeded'
            state.playerTankStatistics[playerTankStatisticsIndex].tankStatisticsFetchError = false
            state.playerTankStatistics[playerTankStatisticsIndex].tankStatistics = [...action.payload] as TankStatistics[]
        }
    }
});


export const tankStatisticsStateSelector = (state: RootState) => state.tankStatisticsState;
export const playerTankStatisticsSelector = createSelector(
    [tankStatisticsStateSelector],
    (tankStatisticsState) => tankStatisticsState.playerTankStatistics
)

export const { addPlayerTankStatistics } = tankStatisticsSlice.actions
export default tankStatisticsSlice.reducer;
