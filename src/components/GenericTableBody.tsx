import { Checkbox, TableBody, TableCell, TableRow } from "@material-ui/core";
import React, { ReactNode } from "react";

export interface GenericTableBodyProps<T> {
    rows: T[]
    columns: (keyof T)[],
    selectedRows: number[],
    rowCellsMapper: (labelId: string, row: T) => (value: keyof T, index: number, array: (keyof T)[]) => JSX.Element;
    onRowClick: (index: number) => void;
}

const GenericTableBody = function <T>(props: GenericTableBodyProps<T> & { children?: ReactNode }) {
    const { rows, columns, rowCellsMapper, onRowClick, selectedRows } = props
    const tableRows = rows?.map((tableRow: T, index: number) => {
        const labelId = `generic-row-checkbox-${index}`;
        const key = `${Object.keys(tableRow).join("_")}_${index}`
        const isSelected = selectedRows.includes(index)
        
        return (
            <TableRow key={key}
                hover
                onClick={() => onRowClick(index)}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={-1}
                selected={isSelected}
            >
                <TableCell padding="checkbox" key={key}>
                    <Checkbox
                        checked={isSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                    />
                </TableCell>
                {columns.map(rowCellsMapper(labelId, tableRow))}
            </TableRow>
        );
    })
    return <TableBody>
        {tableRows}
    </TableBody>
}

export default GenericTableBody;