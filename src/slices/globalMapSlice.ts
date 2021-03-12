import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchStatus, RootState } from ".";
import APPLICATION_ID from "../api/config";
import { buildParamStr } from "../utils/url/urlUtils";

export enum GlobalMapFronts {
    FRONT_TIER_10 = "season_16_eu_tier10m",
    FRONT_TIER_8 = "season_16_eu_tier8m"
}

export class Province {
    arena_id!: string;
    // Map ID
    // Map ID
    arena_name!: string;
    // Localized map name
    // Localized map name
    attackers!: number[];
    // List of IDs of attacking clans
    // List of IDs of attacking clans
    battles_start_at!: string;
    // Battles start time in UTC
    // Battles start time in UTC
    competitors!: number[];
    // List of IDs of participating clans
    // List of IDs of participating clans
    current_min_bet!: number;
    // Current minimum bid
    // Current minimum bid
    daily_revenue!: number;
    // Daily income
    // Daily income
    front_id!: string;
    // Front ID
    // Front ID
    front_name!: string;
    // Front name
    // Front name
    is_borders_disabled!: boolean;
    // Province borders are closed
    // Province borders are closed
    landing_type!: string;
    // Landing type: auction, tournament or null
    // Landing type: auction, tournament or null
    last_won_bet!: number;
    // Last winning bid
    // Last winning bid
    max_bets!: number;
    // Maximum number of bids
    // Maximum number of bids
    neighbours!: string[];
    // List of adjacent provinces' IDs
    // List of adjacent provinces' IDs
    owner_clan_id!: number;
    // Owning clan ID
    // Owning clan ID
    pillage_end_at!: string;
    // Date when province will restore its revenue after ransack
    // Date when province will restore its revenue after ransack
    prime_time!: string;
    // Prime Time in UTC
    // Prime Time in UTC
    province_id!: string;
    // Province ID
    // Province ID
    province_name!: string;
    // Province name
    // Province name
    revenue_level!: number;
    // Income level from 0 to 11. 0 value means that income was not raised.
    // Income level from 0 to 11. 0 value means that income was not raised.
    round_number!: number;
    // Round
    // Round
    server!: string;
    // Server ID
    // Server ID
    status!: string;
    // Tournament status: STARTED, FINISHED or null
    // Tournament status: STARTED, FINISHED or null
    uri!: string;
    // Relative link to province
    // Relative link to province
    world_redivision!: boolean;
    // Indicates if Repartition of the World is active
    // Indicates if Repartition of the World is active
    active_battles!: ActiveBattle;
}

interface ActiveBattle {
    // Current battles
    battle_reward: number
    // Award
    // Warning. The field will be disabled.
    round: number
    // Round
    start_at: string
    // Battle start time in UTC
    clan_a: ClanInBattle
    clan_b: ClanInBattle
}

interface ClanInBattle {
    // First challenging clan ID
    battle_reward: number
    // Award
    clan_id: number
    // Clan ID
    loose_elo_delta: number
    // Changes in Elo-rating due to defeat
    win_elo_delta: number
    // Changes in Elo-rating due to victory
}

interface GlobalMapState {
    provincesFetchStatus: FetchStatus,
    provincesFetchErrors: boolean,
    provinces: Province[],
}

const initialState: GlobalMapState = {
    provincesFetchStatus: 'idle',
    provincesFetchErrors: false,
    provinces: ({} as any) as Province[],
}
const buildProvincesQueryUrl: (url: string, params: any) => string = (url, params: any) => {
    const queryParamStr = buildParamStr(params);
    return `${url}?application_id=${APPLICATION_ID}&${queryParamStr}`;
}

const PROVINCES_API = 'https://api.worldoftanks.eu/wot/globalmap/provinces/'
const provincesApiUrl = buildProvincesQueryUrl(PROVINCES_API, { front_id: GlobalMapFronts.FRONT_TIER_10 })


export const fetchProvincesThunk = createAsyncThunk('globalMap/fetchProvinces', async () => {
    const response: Response = await fetch(provincesApiUrl);
    const json = await response.json();
    return json.data;
})

export const globalMapSlice = createSlice({
    name: 'globalMap',
    initialState,
    reducers: {
    },
    extraReducers: {
        ['globalMap/fetchProvinces/fulfilled']: (state, action: PayloadAction<Province[]>) => {
            if (!!action.payload) {
                state.provinces = action.payload;
                state.provincesFetchStatus = 'succeeded';
                state.provincesFetchErrors = false;
            }
        },
        ['globalMap/fetchProvinces/rejected']: (state, action) => {
            state.provincesFetchStatus = 'failed'
            state.provincesFetchErrors = true
        },
        ['globalMap/fetchProvinces/pending']: (state, action) => {
            state.provincesFetchStatus = 'loading';
        },
    }
});

export const globalMapStateSelector = (state: RootState) => state.globalMapState as GlobalMapState;
export const provincesSelector = createSelector([globalMapStateSelector], (state) => state.provinces)
export default globalMapSlice.reducer