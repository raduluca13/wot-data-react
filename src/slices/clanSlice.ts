import {
    createAsyncThunk,
    createSelector,
    createSlice,
    PayloadAction
} from '@reduxjs/toolkit';
import { FetchStatus, RootState } from '.';
import APPLICATION_ID from '../api/config';
import { ClanDetails, User, Vehicle } from '../screens/vehicles/types';
import { buildParamStr } from '../utils/url/urlUtils';

const CLAN_DETAILS_API = "https://api.worldoftanks.eu/wot/clans/info/"
const CLAN_LIST_API = "https://api.worldoftanks.eu/wot/clans/list/"
const PHONENIX_CLAN_ID = 500061648;
const TANKS_API = 'https://api.worldoftanks.eu/wot/encyclopedia/vehicles/';

interface ClanState {
    clanDetailsFetchStatus: FetchStatus,
    clanDetailsFetchErrors: boolean,
    clanDetails: ClanDetails,
    // TODO - move to new slice for tanks
    tankFetchStatus: FetchStatus,
    tankFetchErrors: boolean;
    tanks: VehicleResponse;
}


interface VehicleResponse {
    [key: number]: Vehicle
}

const initialState: ClanState = {
    clanDetailsFetchStatus: 'idle',
    clanDetailsFetchErrors: false,
    clanDetails: ({} as any) as ClanDetails,
    tankFetchStatus: 'idle',
    tankFetchErrors: false,
    tanks: []
}

const buildClansQueryUrl: (url: string, params: any) => string = (url, params: any) => {
    const queryParamStr = buildParamStr(params);
    return `${url}?application_id=${APPLICATION_ID}&${queryParamStr}`;
}

const buildTanksQueryUrl: (url: string, params: any) => string = (url, params: any) => {
    const queryParamStr = buildParamStr(params);
    return `${url}?application_id=${APPLICATION_ID}&${queryParamStr}`
}

const url = buildClansQueryUrl(CLAN_DETAILS_API, { clan_id: PHONENIX_CLAN_ID })
const tanksUrl = buildTanksQueryUrl(TANKS_API, { tier: 10 })

export const fetchClanDetailsThunk = createAsyncThunk('clanDetails/fetchClanDetails', async () => {
    const response: Response = await fetch(url);
    const json = await response.json();
    return json.data[PHONENIX_CLAN_ID];
})

export const fetchTanksThunk = createAsyncThunk('tanks/fetchTanks', async () => {
    const response = await fetch(tanksUrl);
    const json = await response.json();
    return json.data as Map<number, Vehicle>;
})

export const clanSlice = createSlice({
    name: 'clan',
    initialState,
    reducers: {
    },
    extraReducers: {
        ['clanDetails/fetchClanDetails/fulfilled']: (state, action: PayloadAction<ClanDetails>) => {
            if (!!action.payload) {
                state.clanDetails = action.payload;
                state.clanDetailsFetchStatus = 'succeeded';
                state.clanDetailsFetchErrors = false;
            }
        },
        ['clanDetails/fetchClanDetails/rejected']: (state, action) => {
            state.clanDetailsFetchStatus = 'failed'
            state.clanDetailsFetchErrors = true
        },
        ['clanDetails/fetchClanDetails/pending']: (state, action) => {
            state.clanDetailsFetchStatus = 'loading';
        },
        ['tanks/fetchTanks/fulfilled']: (state, action) => {
            state.tankFetchStatus = 'succeeded'
            const payload = action.payload as VehicleResponse;
            state.tanks = payload;
        },
        ['tanks/fetchTanks/rejected']: (state, action) => {
            state.tankFetchStatus = 'failed'
            state.tankFetchErrors = true;
        },
        ['tanks/fetchTanks/pending']: (state, action) => {
            state.tankFetchStatus = 'loading'
        },
    }
});

// export const { } = clanSlice.actions;


export const clanStateSelector = (state: RootState) => state.clanState;
export const clanDetailsSelector = (state: RootState) => state.clanState.clanDetails;

export const tanksFetchSelector = createSelector(
    [clanStateSelector],
    (clanState) => {
        return {
            tanksFetchStatus: clanState.tankFetchStatus,
            tanksFetchErrors: clanState.tankFetchErrors,
            tanks: clanState.tanks as VehicleResponse
        }
    }
)

export const clanDetailsFetchSelector = createSelector(
    [clanStateSelector],
    (clanState) => {
        return {
            clanDetailsFetchStatus: clanState.clanDetailsFetchStatus,
            clanDetailsFetchErrors: clanState.clanDetailsFetchErrors,
            clanDetails: clanState.clanDetails
        }
    }
)

export const clanMembersSelector = createSelector(
    [clanStateSelector],
    (clanState) => {
        return {
            clanMembers: clanState.clanDetails.members ?? [] as User[]
        }
    }

)

export default clanSlice.reducer;