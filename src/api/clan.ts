import CONFIG from "./config";
import { from, Observable } from 'rxjs';
import { buildParamStr } from "../utils/url/urlUtils";

const CLAN_DETAILS_API = "https://api.worldoftanks.eu/wot/clans/info/"
const CLAN_LIST_API = "https://api.worldoftanks.eu/wot/clans/list/"
const PHONENIX_CLAN_ID = 500061648;

// todo replace with TankType
export enum VehicleType {
    MEDIUM,
    HEAVY,
    SPG,
    LIGHT,
    TD
}

export default function clan() {

    const buildClansQueryUrl: (url: string, params: any) => string = (url, params: any) => {
        const queryParamStr = buildParamStr(params);
        return `${url}?application_id=${CONFIG.APPLICATION_ID}&${queryParamStr}`;
    }

    const getClan: (name: string) => Observable<any> = (name: string) => {
        const url = buildClansQueryUrl(CLAN_LIST_API, { search: name })
        return apiCall(url);
    }

    const getClanDetails: () => any = () => {
        const url = buildClansQueryUrl(CLAN_DETAILS_API, { clan_id: PHONENIX_CLAN_ID })
        return apiCall(url);
    }


    const apiCall: (url: string) => Observable<any> = (url: any) => {
        return from(fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
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
            ))
    }

    return {
    }
}