import React from 'react';
import { DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from 'react-dnd';
import { useSelector } from 'react-redux';
import { PlayerTacticRole } from '../../../../store/types/interfaces/TacticMetadata.interface';
import { tacticRolesSelector } from '../../store/tacticsSlice';
import TacticRole from './TacticRole';


const TacticRoles = (props: ReturnType<typeof collect>) => {
    const tacticRoles = useSelector(tacticRolesSelector);
    const { connectDropTarget } = props;
    const renderTacticRoles = (tacticRole: PlayerTacticRole) => <TacticRole key={tacticRole.index} {...tacticRole} />

    return connectDropTarget(
        <div className="tactic-roles">
            {tacticRoles.map(renderTacticRoles)}
        </div>
    )
}

const dropTargetSpec: DropTargetSpec<PlayerTacticRole> = {
    hover: (props: any, monitor: DropTargetMonitor, component: any) => {
        console.log('hovering ', { props })
        console.log(monitor.isOver({ shallow: true }))
    },
    drop(draggedTarget: PlayerTacticRole) {
        return draggedTarget
    },
    canDrop() {
        // You can disallow drag based on props
        return true;
    }
}

let collect = (connect: DropTargetConnector) => {
    return {
        connectDropTarget: connect.dropTarget(),
        // isOver: monitor.isOver(),
        // canDrop: monitor.canDrop()
    };
}
export default DropTarget("tacticRole", dropTargetSpec, collect)(TacticRoles);