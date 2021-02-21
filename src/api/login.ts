export interface LoginData {
    application_id: string;
    display: LoginDisplayType;
    nofollow: 0 | 1
    expires_at: number;
    redirect_uri: string
}

export enum LoginDisplayType {
    PAGE = "page",
    POPUP = "popup"
}

const login = () => {
    const loginData: LoginData = {
        application_id: "cb96a1fa695145b03a603132c093b238",
        display: LoginDisplayType.PAGE,
        nofollow: 0,
        expires_at: 0,
        // redirect_uri: "localhost:3000"
        redirect_uri: "https%3A%2F%2Fdevelopers.wargaming.net%2Freference%2Fall%2Fwot%2Fauth%2Flogin%2F"
    }

    // const loginUrl = "https://api.worldoftanks.eu/wot/auth/login?";
    // Object.keys(loginData).map((key: string) => `${key=loginData[key]}`)

    fetch("https://api.worldoftanks.eu/wot/auth/login/?application_id=cb96a1fa695145b03a603132c093b238&display=popup&redirect_uri=https%3A%2F%2Fdevelopers.wargaming.net%2Freference%2Fall%2Fwot%2Fauth%2Flogin%2F")
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                // setIsLoaded(true);
                // setItems(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                // setIsLoaded(true);
                // setError(error);
            }
        )
}

export default login;

// https://api.worldoftanks.eu/wot/auth/login/?
// status=ok&
// access_token=26a6cafbdd0d520572988afaf934d18b3a34b13e&
// nickname=ExcisonX&
// account_id=503047828&
// expires_at=1613235656&
// application_id=cb96a1fa695145b03a603132c093b238

// redirect url: https://developers.wargaming.net/reference/all/wot/auth/login/