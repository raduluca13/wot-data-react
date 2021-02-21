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
import InteractiveMap from './interactive-map/InteractiveMap';

const AddTactic = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ tacticId: string }>();
    const tactic: Tactic = useSelector(selectedTacticSelector);

    // TODO - use tacticId to dispactch change of the selected tactic
    const tacticId = params.tacticId === "add" ? DEFAULT_NEW_TACTIC_ID : params.tacticId; // TODO - to be refactored in the future
    

    const onClickAddTactic = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(saveTactic(tactic))
    }, [dispatch, tactic])

    const onClickCancelEdit = useCallback(() => {
        dispatch(cancelTacticChanges(tactic))
        history.push('/tactics');
    }, [dispatch, history, tactic])

    const isFormValid: () => boolean = () => {
        return true
    }

    return (
        <div>
            <InteractiveMap />
            <TacticMetadataForm />
            <TacticRoleForm />
            <hr />
            <DndProvider backend={HTML5Backend}>
                <TacticRoles />
            </DndProvider>
            <hr />

            <Button
                variant="outlined"
                color="primary"
                onClick={onClickAddTactic}
                disabled={!isFormValid()}
            >
                Save Tactic
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                onClick={onClickCancelEdit}
                disabled={!isFormValid()}
            >
                Cancel
            </Button>
        </div>
    )
}

export default AddTactic;