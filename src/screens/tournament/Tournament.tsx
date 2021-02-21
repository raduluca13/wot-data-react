import React from 'react'
import PropTypes from 'prop-types'
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    createStyles,
    Icon,
    makeStyles,
    Theme,
    Typography
} from '@material-ui/core';
import RemoveIcon from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import AccessibleIcon from "@material-ui/icons/Accessible"
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord"

interface TournamentProps {
    id: string;
    description: string;
    numberOfPlayers: number; // number of players/teams depending on format
    battleFormat: string; // replace with a type
    totalPrize: number;

    onRemoveClick: () => void;
    onEditClick: () => void;
}



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tournament: {
            border: '1px solid beige',
            // color: 'darkred',
            float: 'right',
            cursor: 'pointer',
            fill: '#f7c6pc',
        },
        button: {
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
        },
        media: {
            height: 140,
        },
        gold: {
            fill: '#f7c6pc'
        }
    }),
);

const Tournament = ({
    id,
    description,
    numberOfPlayers,
    battleFormat,
    totalPrize,
    onRemoveClick,
    onEditClick,
}: TournamentProps) => {
    const classes = useStyles();

    return (
        <Card className={classes.tournament}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {battleFormat} with a total prize of {totalPrize} gold
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {numberOfPlayers} <AccessibleIcon /> registered
                    </Typography>
                    {/* <Typography variant="body2" color="textSecondary" component="p">
                        {description}
                    </Typography> */}
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" variant="outlined" color="primary" onClick={onEditClick}>
                    <EditIcon />
                </Button>
                <Button size="small" variant="outlined" color="secondary" onClick={onRemoveClick}>
                    <RemoveIcon />
                </Button>
            </CardActions>
        </Card>
    );
}

Tournament.propTypes = {
    // name: PropTypes.string.isRequired
}

export default Tournament;