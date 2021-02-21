import {
    Button,
    createStyles,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Theme
} from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddIcon from "@material-ui/icons/Add";
import { FormGroup } from '@material-ui/core';
import { clanDetailsFetchSelector, fetchClanDetailsThunk } from '../../../slices/clanSlice';
import { User } from '../../vehicles/types';
import {
    createDefaultUser,
    addPlayer,
    AddPlayerToTeamAction,
    selectedTeamIdSelector
} from '../../../slices/teamSlice';


// TODO - this is duplicate with AddTactic.tsx styles, extract
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

const AddPlayer = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const defaultUser = createDefaultUser()
    const [player, setPlayer] = useState(defaultUser);

    const { clanDetails, clanDetailsFetchErrors, clanDetailsFetchStatus } = useSelector(clanDetailsFetchSelector);
    const selectedTeamId = useSelector(selectedTeamIdSelector);

    const onChangePlayer = (event: any) => {
        const playerId = event.target.value;
        const playerIndex = clanDetails.members.findIndex(clanMember => clanMember.account_id === playerId)
        const updatedPlayer = clanDetails.members[playerIndex];
        setPlayer(updatedPlayer);
    }

    useEffect(() => {
        if (clanDetailsFetchStatus === 'idle') {
            dispatch(fetchClanDetailsThunk())
        }
    }, [clanDetailsFetchStatus])

    const onAddPlayer = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(addPlayer({ teamId: selectedTeamId, user: player } as AddPlayerToTeamAction));
        setPlayer(defaultUser);
    }

    const buildPlayerList = () => {
        switch (clanDetailsFetchStatus) {
            case "idle":
                return <MenuItem key=''></MenuItem>;
            case "loading":
                return <MenuItem key=''></MenuItem>;
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

    const buildFormControls = () => {
        return (
            <FormGroup>
                <FormControl className={classes.formControl}>
                    <InputLabel id="player-form-control">Player</InputLabel>
                    <Select
                        labelId="player-form-control"
                        id="player-select"
                        value={player.account_id}
                        onChange={event => onChangePlayer(event)}
                    >
                        {buildPlayerList()}
                    </Select>
                </FormControl>
            </FormGroup>

        )
    }

    const isAddPlayerButtonEnabled = () => {
        return !!player.account_id
    }

    return (
        <div>
            {buildFormControls()}
            <Button
                variant="outlined"
                color="primary"
                onClick={onAddPlayer}
                disabled={!isAddPlayerButtonEnabled()}
            >
                <AddIcon />
            </Button>
        </div>
    )
}


export default AddPlayer;
