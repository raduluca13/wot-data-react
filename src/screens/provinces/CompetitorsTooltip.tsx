import { Tooltip, Typography } from "@material-ui/core"
import React, { useEffect, useRef, useState } from "react"
import { ClanInSearch, clanListFetchSelector, fetchClanDetailsThunk, addClanInSearch, addProvinceToClanInSearch } from "../../slices/clanSlice"
import { useDispatch, useSelector } from 'react-redux';

interface CompetitorsTooltipProps {
    clanIds: number[]
    provinceId: string
}

const CompetitorsTooltip = (props: CompetitorsTooltipProps) => {
    const dispatch = useDispatch()

    const [clanNames, setClanNames] = useState([] as string[])
    const { clansInSearch, clanList } = useSelector(clanListFetchSelector)
    const { clanIds, provinceId } = props

    const buildFragment = () => {
        console.log({ clansInSearch }, { provinceId })
        return clansInSearch.map(clanInSearch => {
            if (clanInSearch.provinceIds && clanInSearch.provinceIds.includes(provinceId)) {
                if (clanInSearch.clanDetails) {
                    return <Typography color="inherit">{clanInSearch.clanDetails.tag}</Typography>
                } else {
                    return <p>Loading clan name</p> // show loading while not all loaded
                }
            }

        })
    }

    useEffect(() => {
        console.log({ clanIds }, { clansInSearch })
        const clansAlreadyInSearch = clansInSearch.map(clanInSearch => clanInSearch.clanId)

        if (clanIds.length > 0) {
            clanIds.forEach(clanId => {
                const existingClanIndex = clansAlreadyInSearch.findIndex(id => id === clanId)
                if (existingClanIndex !== -1) {
                    const existingProvinces = clansInSearch[existingClanIndex].provinceIds
                    if (!existingProvinces.includes(provinceId)) {
                        dispatch(addProvinceToClanInSearch({ provinceId, clanId }))
                    }
                } else {
                    dispatch(addClanInSearch({
                        clanId,
                        clanDetailsFetchErrors: false,
                        clanDetailsFetchStatus: 'idle',
                        provinceIds: [provinceId]
                    } as ClanInSearch))
                }
            })
        }


        if (clansInSearch.length === 0) {
            return;
        }

        const allClansLoaded = clansInSearch.map(clanInSearch => clanInSearch.clanDetailsFetchStatus === "succeeded").length === clansInSearch.length
        if (!allClansLoaded) {
            return;
        }

        clansInSearch.forEach(clanInSearch => {
            if (clanInSearch.clanDetailsFetchStatus === 'idle') {
                console.log("starting processing clan id: ", clanInSearch.clanId)
                dispatch(fetchClanDetailsThunk(clanInSearch.clanId))
            }
        })
    }, [clanList, clanIds, clanNames, provinceId])

    return <React.Fragment>
        {buildFragment()}
    </React.Fragment>
}

export default CompetitorsTooltip