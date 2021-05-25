import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom';
import { cancelTacticChanges, DEFAULT_NEW_TACTIC_ID, saveTactic, selectedTacticSelector } from '../store/tacticsSlice';
import { Tactic } from '../../../store/types/interfaces/TacticMetadata.interface';
import TacticMetadataForm from './tactic-metadata/TacticMetadataForm';
import TacticRoleForm from './tactic-role/TacticRoleForm';
import TacticRoles from './tactic-role/TacticRoles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        addTacticContainer: {
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
        },
        containerForms: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'flex-start',
        },
        containerActions: {
            margin: '2rem 1rem',
            display: 'flex',
            alignSelf: 'flex-end',
            width: '15rem',
            justifyContent: 'space-between'
        }
    }),
);

const AddTactic = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const params = useParams<{ tacticId: string }>();
    const tactic: Tactic = useSelector(selectedTacticSelector);

    // TODO - use tacticId to dispactch change of the selected tactic
    const tacticId = params.tacticId === "add" ? DEFAULT_NEW_TACTIC_ID : params.tacticId; // TODO - to be refactored in the future


    const onClickAddTactic = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(saveTactic(tactic))
        history.push('/tactics')
    }, [dispatch, tactic, history])

    const onClickCancelEdit = useCallback(() => {
        dispatch(cancelTacticChanges(tactic))
        history.push('/tactics');
    }, [dispatch, history, tactic])

    const isFormValid: () => boolean = () => {
        return true
    }

    return (
        <div className={classes.addTacticContainer}>
            <div className={classes.containerActions}>
                <Button variant="outlined" color="primary" onClick={onClickAddTactic} disabled={!isFormValid()}>
                    Save Tactic
                </Button>
                <Button variant="outlined" color="secondary" onClick={onClickCancelEdit} disabled={!isFormValid()}>
                    Cancel
                </Button>
            </div>

            {/* <InteractiveMap /> */}
            <div className={classes.containerForms}>
                <TacticMetadataForm />

                <div>
                    <TacticRoleForm />
                    <hr></hr>
                    <DndProvider backend={HTML5Backend}>
                        <TacticRoles />
                    </DndProvider>
                </div>
            </div>

            <div className={classes.containerActions}>
                <Button variant="outlined" color="primary" onClick={onClickAddTactic} disabled={!isFormValid()}>
                    Save Tactic
                </Button>
                <Button variant="outlined" color="secondary" onClick={onClickCancelEdit} disabled={!isFormValid()}>
                    Cancel
                </Button>
            </div>
        </div>
    )
}

export default AddTactic;