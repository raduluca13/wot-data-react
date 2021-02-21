import {
    makeStyles,
    Theme,
    createStyles,
    Card,
    CardHeader,
    Avatar,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import React, { useCallback } from 'react';
import { changeSelectedTeam, deleteTeam, Team } from '../../../slices/teamSlice';

import RemoveIcon from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
        },
        media: {
            height: 0,
            paddingTop: "56.25%" // 16:9
        },
        avatar: {
            backgroundColor: red[500]
        }
    })
);

const TeamCard = (team: Team) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();

    const onRemoveClick = useCallback(() => {
        dispatch(deleteTeam(team))
    }, [team]);

    const onEditClick = useCallback(() => {
        dispatch(changeSelectedTeam(team.teamId))
        history.push(`/teams/${team.teamId}`)
    }, [team]);

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={<Avatar aria-label="creator" className={classes.avatar} />}
                title={team.teamName}
                subheader=""
            />
            <CardMedia
                className={classes.media}
                image="/static/images/cards/paella.jpg"
                title="Paella dish"
            />
            <CardContent>
                {team.players.length > 0 && team.players.map(player =>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {player.account_name}
                    </Typography>)}
            </CardContent>
            <CardActions disableSpacing>
                <Button variant="outlined" color="secondary" onClick={onEditClick}>
                    <EditIcon />
                </Button>
                <Button variant="outlined" color="secondary" onClick={onRemoveClick}>
                    <RemoveIcon />
                </Button>
            </CardActions>
        </Card >
    );
}


export default TeamCard;