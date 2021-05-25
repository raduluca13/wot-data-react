import {
    Button,
    createStyles,
    FormControl,
    FormGroup,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Theme
} from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from "@material-ui/icons/Add";
import { clanDetailsFetchSelector, fetchClanDetailsThunk, fetchPhoenixClanDetailsThunk } from '../../../../slices/clanSlice';
import { mapFetchDetailsSelector, selectedTacticIdSelector, fetchMapsThunk, addTacticRole } from '../../store/tacticsSlice';
import { PlayerTacticRole } from '../../../../store/types/interfaces/TacticMetadata.interface';
import { User, Vehicle } from '../../../vehicles/types';
import { fetchTanksThunk, tanksFetchSelector } from '../../../../slices/tanksSlice';

const createDefaultTacticRole = () => {
    return {
        playerId: "",
        tankId: ""
    } as PlayerTacticRole;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formGroup: {
            // display: "flex",
            flexDirection: "row"
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
    }),
);

const TacticRoleForm = () => {
    const dispatch = useDispatch();
    const { mapFetchError, mapFetchStatus, maps } = useSelector(mapFetchDetailsSelector)
    const { tanksFetchErrors, tanksFetchStatus, tanks } = useSelector(tanksFetchSelector)
    const { clanDetailsFetchErrors, clanDetailsFetchStatus, clanDetails } = useSelector(clanDetailsFetchSelector);
    const [tacticRole, setTacticRole] = useState(createDefaultTacticRole())
    const tacticId = useSelector(selectedTacticIdSelector);
    const classes = useStyles();

    useEffect(() => {
        if (mapFetchStatus === 'idle') {
            dispatch(fetchMapsThunk())
        }
    }, [mapFetchStatus])

    useEffect(() => {
        if (clanDetailsFetchStatus === 'idle') {
            dispatch(fetchPhoenixClanDetailsThunk())
        }
    }, [clanDetailsFetchStatus])

    useEffect(() => {
        if (tanksFetchStatus === 'idle') {
            dispatch(fetchTanksThunk())
        }
    }, [tanksFetchStatus])

    const onChangePlayer = useCallback((event: any) => {
        const playerId = event.target.value;
        setTacticRole({ ...tacticRole, playerId });
    }, [tacticRole])

    const onChangeTank = useCallback((event: any) => {
        const tankId = event.target.value as string;
        setTacticRole({ ...tacticRole, tankId })
    }, [tacticRole])

    const onClickAddTacticRole = useCallback(() => {
        dispatch(addTacticRole(tacticRole))
        setTacticRole(createDefaultTacticRole())
    }, [tacticRole])

    const isTacticRoleValid: () => boolean = () => {
        return !!tacticRole.playerId && !!tacticRole.tankId
    }

    const buildPlayerList = () => {
        switch (clanDetailsFetchStatus) {
            case "idle":
                return <MenuItem></MenuItem>;
            case "loading":
                return <MenuItem></MenuItem>;
            case "succeeded":
                const members = clanDetails.members;
                return members.map((clanMember: User) => {
                    return <MenuItem key={clanMember.account_id} value={clanMember.account_id}>
                        {clanMember.account_name}
                    </MenuItem>
                });
            case "failed":
                console.error({ clanDetailsFetchErrors })
                return <p>Could not connect server to get info</p>
        }
    }

    const buildTankList = () => {
        switch (tanksFetchStatus) {
            case "idle":
                return <MenuItem></MenuItem>
            case "loading":
                return <MenuItem></MenuItem>
            case "succeeded":
                return Object.keys(tanks).map((key: string) => {
                    return <MenuItem key={key} value={key}>{(tanks[+key] as Vehicle).name}</MenuItem>
                });
            case "failed":
                console.error({ tanksFetchErrors })
                return <p> could not connect server to get info</p>
        }
    }



    const buildTacticRolesFormGroup = () => {
        return (
            <FormGroup className={classes.formGroup}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="player-form-control">Player</InputLabel>
                    <Select
                        labelId="player-form-control"
                        id="player-select"
                        value={tacticRole.playerId}
                        onChange={onChangePlayer}
                    >
                        {buildPlayerList()}
                    </Select>
                </FormControl>
                <FormControl className={classes["formControl"]}>
                    <InputLabel id="player-form-control">Tank</InputLabel>
                    <Select
                        labelId="player-form-control"
                        id="player-select"
                        value={tacticRole.tankId}
                        onChange={onChangeTank}
                    >
                        {buildTankList()}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={onClickAddTacticRole}
                    disabled={!isTacticRoleValid()}
                >
                    <AddIcon />
                </Button>
            </FormGroup >

        )
    }

    return <div>
        {buildTacticRolesFormGroup()}
    </div>
}

export default TacticRoleForm;