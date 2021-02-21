import React from 'react'
import PropTypes from 'prop-types'
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import RemoveIcon from "@material-ui/icons/Remove";
import { useDispatch } from 'react-redux';
import { removePlayer, RemovePlayerFromTeamAction, SelectedTeamIdAction, UserAction } from '../../../slices/teamSlice';
import { User } from '../../vehicles/types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        player: {
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            justifyContent: 'space-between',
            // margin: '1rem 2rem'
        },
    }),
);

const Player = ({ user, teamId }: UserAction) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const onRemoveClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (user) {
            dispatch(removePlayer({ teamId, user } as RemovePlayerFromTeamAction));
        }
    };
    return <div className={classes.player}>
        <span>{user?.account_name}</span>
        {/* style={{ color: 'darkred', float: 'right', cursor: 'pointer' } */}
        <Button variant="outlined" color="secondary" onClick={event => onRemoveClick(event)}>
            <RemoveIcon />
        </Button>
    </div >

}

export default Player;