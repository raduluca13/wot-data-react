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

export interface ClanInSearch {
    clanId: number,
    clanDetails: ClanDetails,
    clanDetailsFetchErrors: boolean,
    clanDetailsFetchStatus: FetchStatus,
}

interface ClanState {
    clanDetailsFetchStatus: FetchStatus,
    clanDetailsFetchErrors: boolean,
    clanDetails: ClanDetails,
    // TODO - move to new slice for tanks
    tankFetchStatus: FetchStatus,
    tankFetchErrors: boolean,
    tanks: VehicleResponse,
    clansInSearch: ClanInSearch[]
    clanList: any[],
    clanListFetchErrors: boolean,
    clanListFetchStatus: FetchStatus
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
    tanks: [],
    clansInSearch: [],
    clanList: [],
    clanListFetchErrors: false,
    clanListFetchStatus: 'idle'
}

const buildClansQueryUrl: (url: string, params: any) => string = (url, params: any) => {
    const queryParamStr = buildParamStr(params);
    return `${url}?application_id=${APPLICATION_ID}&${queryParamStr}`;
}

const buildTanksQueryUrl: (url: string, params: any) => string = (url, params: any) => {
    const queryParamStr = buildParamStr(params);
    return `${url}?application_id=${APPLICATION_ID}&${queryParamStr}`
}

const phoenixUrl = buildClansQueryUrl(CLAN_DETAILS_API, { clan_id: PHONENIX_CLAN_ID })
const tanksUrl = buildTanksQueryUrl(TANKS_API, { tier: 10 })
const clanListUrl = buildClansQueryUrl(CLAN_LIST_API, {})

export const fetchPhoenixClanDetailsThunk = createAsyncThunk('clanDetails/fetchClanDetails', async () => {
    const response: Response = await fetch(phoenixUrl);
    const json = await response.json();
    return json.data[PHONENIX_CLAN_ID];
})

export const fetchClanListThunk = createAsyncThunk('clanList/fetchClanList', async () => {
    const response: Response = await fetch(clanListUrl);
    const json = await response.json();
    return json.data[PHONENIX_CLAN_ID];
})

export const fetchClanDetailsThunk = createAsyncThunk(
    'clanDetails/fetchClanDetailsById',
    async (clanId: number) => {
        console.log("fetching ", clanId)
        const response: Response = await fetch(buildClansQueryUrl(CLAN_DETAILS_API, { clan_id: clanId }));
        console.log({ response })
        const json = await response.json();
        console.log({ json }, { clanId })
        return json.data[clanId];
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
        setClansInSearch: (state, action: PayloadAction<ClanInSearch[]>) => {
            state.clansInSearch = action.payload
        }
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
        ['clanDetails/fetchClanDetailsById/rejected']: (state, action) => {
            if (!!action.payload) {
                const clanInSearchIndex = state.clansInSearch.findIndex(clanInSearch => clanInSearch.clanId === action.payload.clan_id)
                state.clansInSearch[clanInSearchIndex].clanDetailsFetchStatus = 'failed'
                state.clansInSearch[clanInSearchIndex].clanDetailsFetchErrors = true
            }
        },
        ['clanDetails/fetchClanDetailsById/pending']: (state, action) => {
            if (!!action.payload) {
                const clanInSearchIndex = state.clansInSearch.findIndex(clanInSearch => clanInSearch.clanId === action.payload.clan_id)
                state.clansInSearch[clanInSearchIndex].clanDetailsFetchStatus = 'loading'
            }
        },
        ['clanDetails/fetchClanDetailsById/fulfilled']: (state, action: PayloadAction<ClanDetails>) => {
            if (!!action.payload) {
                const clanInSearchIndex = state.clansInSearch.findIndex(clanInSearch => clanInSearch.clanId === action.payload.clan_id)
                state.clansInSearch[clanInSearchIndex].clanDetailsFetchStatus = 'succeeded'
                state.clansInSearch[clanInSearchIndex].clanDetailsFetchErrors = false
                state.clansInSearch[clanInSearchIndex].clanDetails = { ...action.payload }
            }
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
        ['clanList/fetchClanList/fulfilled']: (state, action) => {
            state.clanListFetchStatus = 'succeeded'
            const payload = action.payload;
            state.clanList = payload;
        },
        ['clanList/fetchClanList/rejected']: (state, action) => {
            state.clanListFetchStatus = 'failed'
            state.clanListFetchErrors = true;
        },
        ['clanList/fetchClanList/pending']: (state, action) => {
            state.clanListFetchStatus = 'loading'
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

export const clanListFetchSelector = createSelector(
    [clanStateSelector],
    (clanState) => {
        return {
            clanListFetchStatus: clanState.clanListFetchStatus,
            clanListFetchErrors: clanState.clanListFetchErrors,
            clanList: clanState.clanList,
            clansInSearch: clanState.clansInSearch,
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

export const { setClansInSearch } = clanSlice.actions

export default clanSlice.reducer;