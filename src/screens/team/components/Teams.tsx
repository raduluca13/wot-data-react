import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { changeSelectedTeam, DEFAULT_NEW_TEAM_ID, teamsSelector } from '../../../slices/teamSlice';
import TeamForm from '../TeamForm';
import TeamCard from './TeamCard';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mainSection: {
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
        },
        teams: {
            display: 'flex'
        }
    }),
);

const Teams = () => {
    const dispatch = useDispatch();
    const teams = useSelector(teamsSelector);
    const classes = useStyles();
    const history = useHistory();

    const onAddTeam = useCallback(() => {
        dispatch(changeSelectedTeam(DEFAULT_NEW_TEAM_ID))
        history.push('/teams/add')
    }, [history])


    const renderTeams = useCallback(() => {
        if (teams.length > 1) {
            return teams.map(team => {
                if (team.teamId === DEFAULT_NEW_TEAM_ID) {
                    return;
                }
                return <TeamCard key={team.teamId} {...team} />
            })
        }
    }, [teams])

    return <section className={classes.mainSection}>
        <div className={classes.teams}>
            {renderTeams()}
        </div>
        <Button
            variant="outlined"
            color="primary"
            onClick={onAddTeam}
        >
            Add Team
            </Button>
    </section>
}

export default Teams; 
