import APPLICATION_ID from "./config";
import { from, Observable } from 'rxjs';

const VEHICLES_API_URL = "https://api.worldoftanks.eu/wot/encyclopedia/vehicles/"

// todo replace with TankType
export enum VehicleType {
    MEDIUM,
    HEAVY,
    SPG,
    LIGHT,
    TD
}

export default function vehicles() {
    const buildParamStr: (params: any) => string = (params: any) => {
        return Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&');
    }

    const buildVehiclesQueryUrl: (params: any) => string = (params: any) => {
        const queryParamStr = buildParamStr(params);
        return `${VEHICLES_API_URL}?application_id=${APPLICATION_ID}&${queryParamStr}`;
    }


    const apiCall: (url: string) => Observable<any> = (url: any) => {
        return from(fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    return result;
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

    const getAllVehicles: () => Observable<any> = () => {
        const url = buildVehiclesQueryUrl({});
        return apiCall(url);

    }

    const getAllVehiclesByNation: (nation: string) => Observable<any> = (nation: string) => {
        const url = buildVehiclesQueryUrl({ nation } as any);
        return apiCall(url);
    }

    const getAllVehiclesByTier: (tier: number) => Observable<any> = (tier: number) => {
        const url = buildVehiclesQueryUrl({ tier } as any);
        return apiCall(url);
    }

    const getAllVehiclesByType: (vehicleType: VehicleType) => Observable<any> = (vehicleType: VehicleType) => {
        const url = buildVehiclesQueryUrl({ type: vehicleType } as any);
        return apiCall(url);
    }

    return {
        getAllVehicles,
        getAllVehiclesByNation,
        getAllVehiclesByType,
        getAllVehiclesByTier
    }
}