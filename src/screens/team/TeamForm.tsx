import { FormGroup, FormControl, TextField, createStyles, makeStyles, Theme, Button } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { cancelTeamChanges, changeSelectedTeam, changeTeamName, DEFAULT_NEW_TEAM_ID, saveTeam, selectedTeamSelector, Team } from '../../slices/teamSlice';
import AddPlayer from './components/AddPlayer';
import PlayerList from './components/PlayerList';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        teamName: {

        }
    }),
);


const TeamForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ teamId: string }>();
    const teamId = params.teamId === "add" ? DEFAULT_NEW_TEAM_ID : params.teamId; // TODO - to be refactored in the future
    const editMode = teamId !== DEFAULT_NEW_TEAM_ID;
    const team: Team = useSelector(selectedTeamSelector);
    const [teamName, setTeamName] = useState(team.teamName);

    const onChangeTeamName = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const teamName = event.target.value;
        dispatch(changeTeamName({ teamId: teamId, teamName }))
    }

    const onClickCancelEdit = useCallback(() => {
        dispatch(cancelTeamChanges(team))
        dispatch(changeSelectedTeam(DEFAULT_NEW_TEAM_ID));
        history.push('/teams');
    }, [history, team])

    useEffect(() => {
        if (team == null) {
            setTeamName("")
        } else {
            setTeamName(team.teamName);
        }
    }, [team])

    const onSaveTeam = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(saveTeam(team))
        history.push('/teams');
    }

    const isSaveTeamButtonEnabled = () => {
        const editMode = team.teamId !== DEFAULT_NEW_TEAM_ID
        const teamIsValid = team.players.length === 3 && !!team.teamName;
        return editMode ? (teamIsValid && team.changes.length > 0) : teamIsValid;
    }

    return <div>
        <FormGroup>
            <FormControl className={classes.teamName}>
                <TextField
                    required
                    label="Team Name"
                    value={teamName}
                    onChange={(event) => onChangeTeamName(event)}
                />
            </FormControl>
        </FormGroup>
        <p>Add players</p>
        <AddPlayer />
        <hr />
        <p>Player List</p>
        <PlayerList />
        <Button
            variant="outlined"
            color="primary"
            onClick={event => onSaveTeam(event)}
            disabled={!isSaveTeamButtonEnabled()}
        >
            SAVE TEAM
        </Button>
        <Button
            variant="outlined"
            color="secondary"
            onClick={onClickCancelEdit}
        >
            Cancel
        </Button>
    </div>
}

export default TeamForm;