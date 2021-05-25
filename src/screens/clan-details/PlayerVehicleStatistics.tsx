import React, { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../slices";
import { fetchTanksThunk, tanksFetchSelector } from "../../slices/tanksSlice";
import { PlayerTankStatistics } from "../../slices/tankStastisticsSlice";
import { TankStatistics } from "../vehicles/types";
import PlayerTankStatisticsTabView, { PlayerTankStatisticsTabViewProps } from "./PlayerTankStatisticsTabView";
import { TankAndStatistics } from "./useTabPanels";
import { getEntries } from "./VehicleStatisticsTable";

const PlayerVechicleStatistics = () => {
    const params = useParams() as { playerId: string }
    const playerId = +params.playerId
    const dispatch = useDispatch()

    const getPlayerTanksStatisticsByPlayerId = (state: RootState, playerId: number) => {
        const playerIndex = state.tankStatisticsState.playerTankStatistics.findIndex(
            (playerTankStatistic: PlayerTankStatistics) => +playerTankStatistic.player.account_id === playerId
        )

        if (playerIndex === -1) {
            return {} as any as PlayerTankStatistics
        } else {
            return state.tankStatisticsState.playerTankStatistics[playerIndex]
        }
    }

    const playerTanksStatistics: PlayerTankStatistics = useSelector((state: RootState) => getPlayerTanksStatisticsByPlayerId(state, playerId));
    const { tanks, tanksFetchStatus, tanksFetchErrors } = useSelector(tanksFetchSelector)
    const player = playerTanksStatistics.player;

    useEffect(() => {
        if (tanksFetchStatus === "idle") {
            dispatch(fetchTanksThunk())
        }
    }, [tanksFetchStatus])

    const buildVehicleStatisticsDashboard: () => JSX.Element = useCallback(() => {
        if (tanksFetchStatus === "loading" || playerTanksStatistics.tankStatistics === undefined) {
            return <p>Loading tanks</p>;
        }


        // const tankStatisticsReducer = (accumulator: Map<any, any>, value: any) => {
        //     map.set(value[0], value[1])
        //     return accumulator
        // }

        const statsMap = new Map([]);

        const tier10Statistics = playerTanksStatistics.tankStatistics
            .filter((tankStatistics: TankStatistics) => tanks[tankStatistics.tank_id] !== undefined)
            .map(tankStatistics => {
                const entries = new Map(getEntries<TankStatistics>(tankStatistics))
                const tank = { ...tanks[tankStatistics.tank_id] }

                statsMap.set(tank.name, entries)

                return tankStatistics
            })

        const playerTankStatisticsTabViewProps = {
            tabsMap: statsMap,
        } as PlayerTankStatisticsTabViewProps

        return <div>
            <PlayerTankStatisticsTabView {...playerTankStatisticsTabViewProps} />
        </div>

    }, [tanks, tanksFetchStatus, playerTanksStatistics])

    return buildVehicleStatisticsDashboard()
}

export default PlayerVechicleStatistics