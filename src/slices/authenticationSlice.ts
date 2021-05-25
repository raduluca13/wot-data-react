import {
    createAsyncThunk,
    createSelector,
    createSlice,
    PayloadAction
} from '@reduxjs/toolkit';
import { FetchStatus, RootState } from '.';
import APPLICATION_ID from '../api/config';

const LOGIN_API = 'https://api.worldoftanks.eu/wot/auth/login/'

interface AuthenticationState {
    authenticationFetchErrors: boolean,
    authenticationFetchStatus: FetchStatus,
}

const initialState: AuthenticationState = {
    authenticationFetchErrors: false,
    authenticationFetchStatus: 'idle',
}

const buildLoginUrl: () => string = () => {
    return `${LOGIN_API}?application_id=${APPLICATION_ID}&expires_at=1623156863&display=page&no_follow=0&redirect_uri=https://wot-data-client.herokuapp.com/`;
}

export const loginThunk = createAsyncThunk('authentication/login', async () => {
    const response: Response = await fetch(buildLoginUrl(), {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "htpps://wot-data-client.herokuapp.com",
            "Referer": "https://wot-data-client.herokuapp.com",
            "Origin": "htpps://wot-data-client.herokuapp.com"
        }
    });
    const json = await response.json();
    return json//.data[PHONENIX_CLAN_ID];
})

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
    },
    extraReducers: {
        ['authentication/login/fulfilled']: (state, action: PayloadAction<any>) => {
            console.log({ action })
        },
        ['authentication/login/rejected']: (state, action) => {
            console.log({ action })
        },
        ['authentication/login/pending']: (state, action) => {
            console.log({ action })
        }
    }
});

export const authenticationStateSelector = (state: RootState) => state.authenticationState;

export const authenticationFetchSelector = createSelector(
    [authenticationStateSelector],
    (authenticationState) => {
        return {
            authenticationFetchStatus: authenticationState.authenticationFetchStatus,
            authenticationFetchErrors: authenticationState.authenticationFetchErrors,
        }
    }
)

export const { } = authenticationSlice.actions

export default authenticationSlice.reducer;