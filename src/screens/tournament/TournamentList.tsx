import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { RootState } from "../../slices";
import { removeTournament, selectTournaments } from '../../slices/tournamentSlice';
import Tournament from './Tournament';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tournaments: {

        },
        tournamentsContainer: {
            border: '1px solid green',
            display: 'flex',
            flexDirection: 'row',
            marginTop: '5%',
        },
    }),
);

const TournamentList = () => {
    const { tournamentList } = useSelector(
        (state: RootState) => state.tournamentState
    )
    const classes = useStyles();
    const history = useHistory();
    const editTournament = useCallback(
        (tournament) => history.push('/edit-tournament', { state: tournament }),
        [history]
    )

    return (
        <div className={classes.tournaments}>
            {/* <span>{tournamentList.length} Tournaments</span> */}
            <div className={classes.tournamentsContainer}>
                {tournamentList.map((tournament, key) => (
                    <Tournament key={key}
                        {...tournament}
                        onRemoveClick={() => removeTournament(tournament)}
                        onEditClick={() => editTournament(tournament)}
                    />
                ))}
            </div>
        </div>
    )
}


export default TournamentList;

