import { Checkbox, TableBody, TableCell, TableRow } from "@material-ui/core";
import React, { ReactNode } from "react";

export interface GenericTableBodyProps<T> {
    rows: T[]
    columns: (keyof T)[],
    selectedIndexes: number[],
    page: number,
    rowsPerPage: number,
    rowCellsMapper: (labelId: string, row: T) => (value: keyof T, index: number, array: (keyof T)[]) => JSX.Element;
    onRowClick: (index: number, page: number, rowsPerPage: number) => void;
}

const GenericTableBody = function <T>(props: GenericTableBodyProps<T> & { children?: ReactNode }) {
    const { rows, columns, rowCellsMapper, onRowClick, selectedIndexes, page, rowsPerPage } = props
    const tableRows = rows?.map((tableRow: T, index: number) => {
        const labelId = `generic-row-checkbox-${index}`;
        const key = `${Object.keys(tableRow).join("_")}_${index}`
        const actualIndex = page * rowsPerPage + index
        const isSelected = selectedIndexes.includes(actualIndex)

        return (
            <TableRow key={key}
                hover
                onClick={() => onRowClick(index, page, rowsPerPage)}
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