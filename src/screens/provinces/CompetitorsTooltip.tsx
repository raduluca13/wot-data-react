import { Typography } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { ClanInSearch, clanListFetchSelector, fetchClanDetailsThunk, setClansInSearch } from "../../slices/clanSlice"
import { useDispatch, useSelector } from 'react-redux';

interface CompetitorsTooltipProps {
    clanIds: number[]
}

const CompetitorsTooltip = (props: CompetitorsTooltipProps) => {
    const [clanNames, setClanNames] = useState([] as string[])
    const dispatch = useDispatch()
    const { clansInSearch, clanList } = useSelector(clanListFetchSelector)

    const { clanIds } = props

    const buildFragment = () => {
        return clansInSearch.map(clanInSearch => {
            if (clanInSearch.clanDetails) {
                return <Typography color="inherit">{clanInSearch.clanDetails.tag}</Typography>
            } else {
                return <p></p> // show loading while not all loaded
            }
        })
    }

    useEffect(() => {
        console.log({ clanIds }, { clansInSearch })

        if (clanIds.length > 0 && clansInSearch.length === 0) {
            dispatch(setClansInSearch(clanIds.map(clanId => {
                return {
                    clanId,
                    clanDetailsFetchErrors: false,
                    clanDetailsFetchStatus: 'idle'
                } as ClanInSearch
            })))
        }

        if (clansInSearch.length > 0) {
            clansInSearch.forEach(clanInSearch => {
                if (clanInSearch.clanDetailsFetchStatus === 'idle') {
                    console.log("starting processing clan id: ", clanInSearch.clanId)
                    dispatch(fetchClanDetailsThunk(clanInSearch.clanId))
                }
            })
        }
        // clanList.filter(clan => clan.)
    }, [clanList, clanIds, clanNames])

    return <React.Fragment>
        {buildFragment()}
    </React.Fragment>
}

export default CompetitorsTooltip