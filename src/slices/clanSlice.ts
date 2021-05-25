import {
    createAsyncThunk,
    createSelector,
    createSlice,
    PayloadAction
} from '@reduxjs/toolkit';
import { FetchStatus, RootState } from '.';
import CONFIG from '../api/config';
import { ClanDetails, User, Vehicle } from '../screens/vehicles/types';
import { buildParamStr } from '../utils/url/urlUtils';

const CLAN_DETAILS_API = "https://api.worldoftanks.eu/wot/clans/info/"
const CLAN_LIST_API = "https://api.worldoftanks.eu/wot/clans/list/"
const PHONENIX_CLAN_ID = 500061648;

export interface ClanInSearch {
    clanId: number,
    provinceIds: string[],
    clanDetails: ClanDetails,
    clanDetailsFetchErrors: boolean,
    clanDetailsFetchStatus: FetchStatus,
}

interface ClanState {
    clanDetailsFetchStatus: FetchStatus,
    clanDetailsFetchErrors: boolean,
    clanDetails: ClanDetails,
    clansInSearch: ClanInSearch[]
    clanList: any[],
    clanListFetchErrors: boolean,
    clanListFetchStatus: FetchStatus
}


const initialState: ClanState = {
    clanDetailsFetchStatus: 'idle',
    clanDetailsFetchErrors: false,
    clanDetails: ({} as any) as ClanDetails,
    clansInSearch: [],
    clanList: [],
    clanListFetchErrors: false,
    clanListFetchStatus: 'idle'
}

const buildClansQueryUrl: (url: string, params: any) => string = (url, params: any) => {
    const queryParamStr = buildParamStr(params);
    return `${url}?application_id=${CONFIG.APPLICATION_ID}&${queryParamStr}`;
}

const phoenixUrl = buildClansQueryUrl(CLAN_DETAILS_API, { clan_id: PHONENIX_CLAN_ID })
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
        const response: Response = await fetch(buildClansQueryUrl(CLAN_DETAILS_API, { clan_id: clanId }));
        const json = await response.json();
        return json.data[clanId];
    }
)

export const clanSlice = createSlice({
    name: 'clan',
    initialState,
    reducers: {
        addClanInSearch: (state, action: PayloadAction<ClanInSearch>) => {
            const clanInSearch = action.payload;
            state.clansInSearch.push({ ...clanInSearch })
        },
        addProvinceToClanInSearch: (state, action: PayloadAction<{ provinceId: string, clanId: number }>) => {
            const { provinceId, clanId } = action.payload
            const clanIndex = state.clansInSearch.findIndex(clanInSearch => clanInSearch.clanId === clanId)
            state.clansInSearch[clanIndex].provinceIds.push(provinceId)
        }
    },
    extraReducers: {
        ['clanDetails/fetchClanDetails/fulfilled']: (state, action: PayloadAction<ClanDetails>) => {
            state.clanDetails = action.payload;
            state.clanDetailsFetchStatus = 'succeeded';
            state.clanDetailsFetchErrors = false;
        },
        ['clanDetails/fetchClanDetails/rejected']: (state, action) => {
            state.clanDetailsFetchStatus = 'failed'
            state.clanDetailsFetchErrors = true
        },
        ['clanDetails/fetchClanDetails/pending']: (state, action) => {
            state.clanDetailsFetchStatus = 'loading';
        },
        ['clanDetails/fetchClanDetailsById/rejected']: (state, action) => {
            const clanInSearchIndex = state.clansInSearch.findIndex(clanInSearch => clanInSearch.clanId === action.payload.clan_id)
            state.clansInSearch[clanInSearchIndex].clanDetailsFetchStatus = 'failed'
            state.clansInSearch[clanInSearchIndex].clanDetailsFetchErrors = true
        },
        ['clanDetails/fetchClanDetailsById/pending']: (state, action) => {
            const clanInSearchIndex = state.clansInSearch.findIndex(clanInSearch => clanInSearch.clanId === action.payload.clan_id)
            state.clansInSearch[clanInSearchIndex].clanDetailsFetchStatus = 'loading'
        },
        ['clanDetails/fetchClanDetailsById/fulfilled']: (state, action: PayloadAction<ClanDetails>) => {
            const clanInSearchIndex = state.clansInSearch.findIndex(clanInSearch => clanInSearch.clanId === action.payload.clan_id)
            state.clansInSearch[clanInSearchIndex].clanDetailsFetchStatus = 'succeeded'
            state.clansInSearch[clanInSearchIndex].clanDetailsFetchErrors = false
            state.clansInSearch[clanInSearchIndex].clanDetails = { ...action.payload }
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

export const clanStateSelector = (state: RootState) => state.clanState;
export const clanDetailsSelector = (state: RootState) => state.clanState.clanDetails;

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

export const { addClanInSearch, addProvinceToClanInSearch } = clanSlice.actions

export default clanSlice.reducer;