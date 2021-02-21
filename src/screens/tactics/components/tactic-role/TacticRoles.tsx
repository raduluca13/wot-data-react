import React from 'react';
import { DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from 'react-dnd';
import { useSelector } from 'react-redux';
import { PlayerTacticRole } from '../../../../store/types/interfaces/TacticMetadata.interface';
import { tacticRolesSelector } from '../../store/tacticsSlice';
import TacticRole from './TacticRole';


const TacticRoles = (props: ReturnType<typeof collect>) => {
    const tacticRoles = useSelector(tacticRolesSelector);
    const { canDrop, isOver, connectDropTarget } = props;
    const renderTacticRoles = (tacticRole: PlayerTacticRole, index: number) => <TacticRole key={tacticRole.playerId} {...tacticRole} />

    return connectDropTarget(
        <div className="tactic-roles">
            {tacticRoles.map(renderTacticRoles)}
        </div>
    )
}

const dropTargetSpec: DropTargetSpec<PlayerTacticRole> = {
    drop(props: PlayerTacticRole, monitor: DropTargetMonitor) {
        console.log("dropping", { props })
        return props
    },
    canDrop(props: PlayerTacticRole) {
        // You can disallow drag based on props
        // return props.isReady
        console.log("can drop: ", true)
        return true;
    }
}

let collect = (connect: DropTargetConnector, monitor: DropTargetMonitor, props: unknown) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}
export default DropTarget("tacticRole", dropTargetSpec, collect)(TacticRoles);