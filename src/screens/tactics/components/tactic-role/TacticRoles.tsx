import { createStyles, makeStyles, Radio, Theme } from '@material-ui/core';
import React from 'react';
import { DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from 'react-dnd';
import { useSelector } from 'react-redux';
import { PlayerTacticRole } from '../../../../store/types/interfaces/TacticMetadata.interface';
import { tacticRolesSelector } from '../../store/tacticsSlice';
import TacticRole from './TacticRole';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tacticRoleListItem: {
            display: 'flex',
            alignItems: 'center'
        },
        tacticRoleRadio: {
            width: '5%'
        }
    })
)
const TacticRoles = (props: ReturnType<typeof collect>) => {
    const classes = useStyles();
    const { connectDropTarget } = props;
    const tacticRoles = useSelector(tacticRolesSelector);
    const [selectedRole, setSelectedRole] = React.useState(0);
    console.log({ tacticRoles })
    const changeSelectedRole = (event: any) => {
        setSelectedRole(+event.target.value);
    };

    const renderTacticRoles = (tacticRole: PlayerTacticRole) => {
        return (
            <div key={'tacticRoleContainer' + tacticRole.index} className={classes.tacticRoleListItem}>
                <Radio
                    key={'roleRadio' + tacticRole.playerId}
                    checked={selectedRole === tacticRole.index}
                    onChange={changeSelectedRole}
                    value={tacticRole.index}
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'A' }}
                />
                <TacticRole key={'role' + tacticRole.playerId} {...tacticRole} />
            </div>
        )
    }

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