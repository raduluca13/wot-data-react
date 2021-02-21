import React, { useCallback } from 'react';

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import RemoveIcon from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Tactic } from '../../../store/types/interfaces/TacticMetadata.interface';
import { removeTactic, changeSelectedTactic } from '../store/tacticsSlice';

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

const TacticCard = (tactic: Tactic) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const onRemoveClick = useCallback(() => {
    dispatch(removeTactic(tactic))
  }, [tactic]);

  const onEditClick = useCallback(() => {
    dispatch(changeSelectedTactic({ id: tactic.id }))
    history.push(`/tactics/${tactic.id}`)
  }, [tactic]);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<Avatar aria-label="creator" className={classes.avatar} />}
        title={tactic.metadata.tacticReference}
        subheader=""
      />
      <CardMedia
        className={classes.media}
        src=""
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {tactic.metadata.baseNumber}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {tactic.metadata.mapName}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {tactic.metadata.tacticType}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button variant="outlined" color="secondary" onClick={onEditClick}>
          <EditIcon />
        </Button>
        <Button variant="outlined" color="secondary" onClick={onRemoveClick}>
          <RemoveIcon />
        </Button>
      </CardActions>
    </Card>
  );
}


export default TacticCard;