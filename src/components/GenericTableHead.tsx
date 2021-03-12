import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { ReactNode, useCallback } from "react"
import { Order } from "../utils/generic-table/genericTableUtils";

interface GenericTableHeadProps<T> {
    classes: any; //ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    headCells: HeadCell<T>[]
}

export interface HeadCell<T> {
    disablePadding: boolean;
    id: keyof T;
    label: string;
    numeric: boolean;
}


const GenericTableHead = function <T>(props: GenericTableHeadProps<T> & { children?: ReactNode }) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    const buildCheckboxCell = () => {
        return <TableCell padding="checkbox">
            <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{ 'aria-label': 'select all desserts' }}
            />
        </TableCell>
    }

    const buildCells = () => {
        return props.headCells.map((headCell) => (
            <TableCell
                key={headCell.label}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === headCell.id ? order : false}
            >
                <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                        <span className={classes.visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                    ) : null}
                </TableSortLabel>
            </TableCell>
        ))
    }

    const buildTableHead = useCallback(() => {
        return <TableHead>
            <TableRow>
                {buildCheckboxCell()}
                {buildCells()}
            </TableRow>
        </TableHead>
    }, [props])


    return buildTableHead();
}


export default GenericTableHead;