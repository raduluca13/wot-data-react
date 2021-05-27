import {
    createAsyncThunk,
    createSelector,
    createSlice,
    PayloadAction
} from '@reduxjs/toolkit';
import { FetchStatus, RootState } from '.';
import CONFIG from '../api/config';
export const LOGIN_API = 'http://api.worldoftanks.eu/wot/auth/login/'


export type LoginResponseKey = keyof LoginResponse;
export interface LoginResponse {
    // ok — successful authentication
    status?: string | null,
    // access token is passed in to all methods that require authentication
    access_token?: string | null,
    expires_at?: string | null
    account_id?: string | null
    nickname?: string | null
}

interface AuthenticationState {
    authenticationFetchErrors: boolean,
    authenticationFetchStatus: FetchStatus,
    userLoggedIn: LoginResponse
}

const initialState: AuthenticationState = {
    authenticationFetchErrors: false,
    authenticationFetchStatus: 'idle',
    userLoggedIn: {
        status: null,
        // access token is passed in to all methods that require authentication
        access_token: null,
        expires_at: null,
        account_id: null,
        nickname: null
    }
}

export const buildLoginUrl: () => string = () => {
    return `${LOGIN_API}?application_id=${CONFIG.APPLICATION_ID}&no_follow=1&redirect_uri=${CONFIG.REDIRECT_URL}`;
}

export const loginWithXHR = () => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", buildLoginUrl());

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Allow-Origin", CONFIG.ALLOW_ORIGIN_VALUE)

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            console.log("bla bla")
        }
    }

    xhr.send(`application_id=${CONFIG.APPLICATION_ID}&no_follow=1&allow=Confirm`);
}

export const loginThunk = createAsyncThunk('authentication/login', async () => {
    loginWithXHR();
})

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setUserLoggedIn: (state, action: PayloadAction<LoginResponse>) => {
            state.userLoggedIn = action.payload
            state.authenticationFetchStatus = "succeeded"
        }
    },
    extraReducers: {
        ['authentication/login/fulfilled']: (state, action: PayloadAction<any>) => {
            console.log({ action })
            state.authenticationFetchStatus = "succeeded"
        },
        ['authentication/login/rejected']: (state, action) => {
            state.authenticationFetchStatus = "failed"
        },
        ['authentication/login/pending']: (state, action) => {
            console.log({ action })
            state.authenticationFetchStatus = "loading"
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
            userLoggedIn: authenticationState.userLoggedIn
        }
    }
)


export const { setUserLoggedIn } = authenticationSlice.actions
export default authenticationSlice.reducer;