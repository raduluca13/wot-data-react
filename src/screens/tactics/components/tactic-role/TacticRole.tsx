import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import RemoveIcon from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { clanDetailsFetchSelector, clanMembersSelector, fetchClanDetailsThunk, fetchPhoenixClanDetailsThunk, tanksFetchSelector } from '../../../../slices/clanSlice';
import { PlayerTacticRole } from '../../../../store/types/interfaces/TacticMetadata.interface';
import { getProperty } from '../../../../slices/teamSlice';
import { DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec, useDrag, useDrop } from 'react-dnd';
import { removeTacticRole } from '../../store/tacticsSlice';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tacticRole: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },
        actions: {
            display: "flex",
            flexDirection: "row"
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
    const { isDragging, connectDragSource } = props;
    const { clanDetailsFetchErrors, clanDetailsFetchStatus, clanDetails } = useSelector(clanDetailsFetchSelector);
    const { tanksFetchErrors, tanksFetchStatus, tanks } = useSelector(tanksFetchSelector);
    const { clanMembers } = useSelector(clanMembersSelector)



    const [name, setName] = useState("")
    const [tank, setTank] = useState("")

    const onEditClick = useCallback(() => {}, [tacticRole, tank, name]);

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
        <div className={classes.tacticRole}>
            <p>{name}</p>
            <p>{tank}</p>
            {/* some button actions */}
            <div className={classes.actions}>
                <Button variant="outlined" color="secondary" onClick={onEditClick}>
                    <EditIcon />
                </Button>
                <Button variant="outlined" color="secondary" onClick={onRemoveClick}>
                    <RemoveIcon />
                </Button>
            </div>
        </div>
    )
}

const tacticRoleSpec: DragSourceSpec<PlayerTacticRole, any> = {
    beginDrag(props, monitor: DragSourceMonitor) {
        console.log("begin drag", { props })
        return props
    },
    endDrag(props: PlayerTacticRole, monitor, component) {
        if (!monitor.didDrop()) {
            return;
        }
        console.log("ending drag: ", { props })
        // When dropped on a compatible target, do something.
        // Read the original dragged item from getItem():
        const dragItem = monitor.getItem()
        console.log({ dragItem })

        // You may also read the drop result from the drop target
        // that handled the drop, if it returned an object from
        // its drop() method.
        const dropResult = monitor.getDropResult()
        console.log({ dropResult })
        // This is a good place to call some Flux action
        // TODO - dispatch change index
        // changeTacticRoleIndex(dragItem.index, dropResult.)
    },
    isDragging(props: PlayerTacticRole, monitor) {
        console.log("dragging item", monitor.getItem(), { props })
        if (monitor.getItem().id !== props.index) {

        }
        return monitor.getItem().id === props.index
    },
    canDrag(props: PlayerTacticRole) {
        // You can disallow drag based on props
        // return props.isReady
        console.log("can drag: ", true)
        return true;
    }
}

const collect = (connect: DragSourceConnector, monitor: DragSourceMonitor, props: unknown) => {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    }
}
export default DragSource("tacticRole", tacticRoleSpec, collect)(TacticRole);