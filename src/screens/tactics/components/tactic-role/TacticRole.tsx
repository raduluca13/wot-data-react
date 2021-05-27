import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RemoveIcon from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { clanDetailsFetchSelector, clanMembersSelector, fetchPhoenixClanDetailsThunk } from '../../../../slices/clanSlice';
import { PlayerTacticRole } from '../../../../store/types/interfaces/TacticMetadata.interface';
import { getProperty } from '../../../../slices/teamSlice';
import { DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec, useDrag, useDrop } from 'react-dnd';
import { removeTacticRole } from '../../store/tacticsSlice';
import { tanksFetchSelector } from '../../../../slices/tanksSlice';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tacticRoleContainer: {
            width: '90%',
            display: "inline-flex",
            gap: '10%',
            alignItems: "center",
            justifyContent: 'space-between'
        },
        tacticRoleDetails: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            alignItems: 'center',
            gap: '10%',
            width: '80%'
        },
        tacticRoleActions: {
            display: "inline-flex",
            gap: '10%'
        },
        button: {
            minWidth: '1rem',
            height: '1.5rem'
        },
        wordWrap: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100px'
        }
    })
);

type TacticRoleProps = PlayerTacticRole & ReturnType<typeof collect>
const TacticRole = (props: TacticRoleProps) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const tacticRole = {
        tankId: props.tankId,
        playerId: props.playerId,
        index: props.index
    } as PlayerTacticRole
    const { connectDragSource } = props;
    const { clanDetailsFetchErrors, clanDetailsFetchStatus, clanDetails } = useSelector(clanDetailsFetchSelector);
    const { tanksFetchErrors, tanksFetchStatus, tanks } = useSelector(tanksFetchSelector);
    const { clanMembers } = useSelector(clanMembersSelector)



    const [name, setName] = useState("")
    const [tank, setTank] = useState("")

    const onEditClick = useCallback(() => { }, [tacticRole, tank, name]);

    const onRemoveClick = useCallback(() => {
        dispatch(removeTacticRole(tacticRole))
    }, [tacticRole, tank, name])

    useEffect(() => {
        if (clanDetailsFetchStatus === 'idle') {
            dispatch(fetchPhoenixClanDetailsThunk())
        }

        if (clanDetailsFetchStatus === "succeeded" && clanMembers.length > 0) {
            const playerId = tacticRole.playerId
            const newPlayer = clanMembers.find(member => member.account_id === playerId);
            if (newPlayer != null) {
                setName(newPlayer.account_name)
            }
        }

        if (tanksFetchStatus === "succeeded") {
            const tankId = tacticRole.tankId
            const newTank = getProperty(tanks, +tankId)
            setTank(newTank.name)
        }

    }, [tacticRole, clanDetailsFetchStatus, tanksFetchStatus, clanMembers])

    return connectDragSource(
        <div className={classes.tacticRoleContainer}>
            <div className={classes.tacticRoleDetails}>
                <p className={classes.wordWrap}>{name}</p>
                <p className={classes.wordWrap}>{tank}</p>
            </div>
            {/* some button actions */}
            <div className={classes.tacticRoleActions}>
                <Button className={classes.button} variant="outlined" color="secondary" onClick={onEditClick}>
                    <EditIcon />
                </Button>
                <Button className={classes.button} variant="outlined" color="secondary" onClick={onRemoveClick}>
                    <RemoveIcon />
                </Button>
            </div>
        </div>
    )
}

const tacticRoleSpec: DragSourceSpec<PlayerTacticRole, any> = {
    beginDrag(draggedTarget: PlayerTacticRole, monitor: DragSourceMonitor) {
        console.log("begin drag", { draggedTarget }, { monitor })
        return draggedTarget
    },
    endDrag(currentTarget: PlayerTacticRole, monitor: DragSourceMonitor, component) {
        if (!monitor.didDrop()) {
            return;
        }
        console.log("ending drag: ", { currentTarget }, { component })
        // When dropped on a compatible target, do something.
        // Read the original dragged item from getItem():
        const draggedItem = monitor.getItem()
        console.log({ currentTarget }, { draggedItem })

        // You may also read the drop result from the drop target
        // that handled the drop, if it returned an object from
        // its drop() method.
        const dropResult = monitor.getDropResult()
        console.log({ dropResult })
        // This is a good place to call some Flux action
        // TODO - dispatch change index
        // changeTacticRoleIndex(dragItem.index, dropResult.)
    },
    isDragging(draggetTarget: PlayerTacticRole, monitor: DragSourceMonitor) {
        // console.log("dragging item", monitor.getItem(), { draggetTarget }, { monitor })
        // if (monitor.getItem().id !== draggetTarget.index) {
        //     console.log("is over another one")
        // }
        // return monitor.getItem().id === draggetTarget.index
        return true;
    },
    canDrag(target: PlayerTacticRole) {
        // You can disallow drag based on props
        return true;
    }
}

const collect = (connect: DragSourceConnector, monitor: DragSourceMonitor, props: unknown) => {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        // isDragging: monitor.isDragging()
    }
}
export default DragSource("tacticRole", tacticRoleSpec, collect)(TacticRole);