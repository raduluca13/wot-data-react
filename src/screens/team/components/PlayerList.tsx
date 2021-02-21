import React from 'react';
import Player from './Player';
import { RootState } from '../../../slices';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';
import { DEFAULT_NEW_TEAM_NAME, saveTeam, selectedTeamIdSelector, selectedTeamSelector } from '../../../slices/teamSlice';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        playerList: {
            display: 'flex',
            flexDirection: 'column'
        },
    }),
);

const PlayerList = () => {
    const classes = useStyles();
    
    const selectedTeamId = useSelector(selectedTeamIdSelector)
    const team = useSelector(selectedTeamSelector)
    
    const players = team?.players ?? []; // ?

    return <div className={classes.playerList}>
        <span>{players.length} players selected</span>
        {players.map(player => (
            <Player key={player.account_id} teamId={team.teamId} user={player} />
        ))}
    </div>
}

export default PlayerList;

