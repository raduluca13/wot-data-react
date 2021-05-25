import {
    makeStyles,
    Theme,
    createStyles,
    Card,
    CardContent,
    Typography,
    CardActions,
} from '@material-ui/core';
import React, { useCallback } from 'react';
import { User } from '../vehicles/types';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchTankStatisticsByPlayerThunk } from '../../slices/tankStastisticsSlice';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            // maxWidth: "max-content",
            margin: "8px"
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
    })
);

const ClanMember = (user: User) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();

    const onDetailsClick = useCallback(() => {
        // TODO - check FetchStatus before doing a re-call maybe
        dispatch(fetchTankStatisticsByPlayerThunk({ account_id: +user.account_id }))
        history.push(`/tank-statistics/${user.account_id}`)
    }, [dispatch, history, user]);

    return (
        <Card className={classes.card} onClick={onDetailsClick}>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    id: {user.account_id}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    name: {user.account_name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    role: {user.role}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton
                    onClick={onDetailsClick}
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>
        </Card >
    )
}

export default ClanMember;