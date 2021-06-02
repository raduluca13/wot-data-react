import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';
import TacticCard from './TacticCard';
import { useHistory } from 'react-router-dom';
import { changeSelectedTeam } from '../../../slices/teamSlice';
import { allTacticsSelector, DEFAULT_NEW_TACTIC_ID } from '../store/tacticsSlice';
import { Tactic } from '../../../store/types/interfaces/TacticMetadata.interface';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mainSection: {
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
        },
        tactics: {
            display: 'flex'
        }
    })
);

const Tactics = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const tactics = useSelector(allTacticsSelector);
    const history = useHistory();

    const onAddTactic = useCallback(() => {
        dispatch(changeSelectedTeam(DEFAULT_NEW_TACTIC_ID))
        history.push('/tactics/add')
    }, [dispatch, history])

    const renderTactics = () => {
        return tactics.map(renderTactic)
    }

    const renderTactic = (tactic: Tactic) => {
        if (tactic.id === DEFAULT_NEW_TACTIC_ID) {
            return;
        } else {
            return <TacticCard key={tactic.id} {...tactic} />
        }
    }

    return (
        <div className={classes.mainSection}>
            {renderTactics()}
            <Button
                variant="outlined"
                color="primary"
                onClick={onAddTactic}
            >
                Add Tactic
            </Button>
        </div>
    )
}

export default Tactics;