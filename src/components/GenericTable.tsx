import { Table, TableContainer, TablePagination } from "@material-ui/core";
import React, { ElementType, ReactNode, MouseEvent, ChangeEventHandler } from "react"
import GenericTableHead, { GenericTableHeadProps } from "./GenericTableHead";
import GenericTableBody, { GenericTableBodyProps } from "./GenericTableBody";
import { ClassNameMap } from "@material-ui/styles";
import GenericTableToolbar, { GenericTableToolbarProps } from "./GenericTableToolbar";

export interface GenericTableProps<T> {
    classes: ClassNameMap
    headerProps: GenericTableHeadProps<T>
    bodyProps: GenericTableBodyProps<T>
    paginationProps?: GenericTablePaginationProps<T>
    toolbarProps: GenericTableToolbarProps,
    paginationEnabled: boolean
}

export interface GenericTablePaginationProps<T> {
    rowsPerPageOptions: number[],
    component: ElementType<any>, // "div" | ("canvas" | "p"...  ?? )
    count: number,
    page: number,
    rowsPerPage: number,
    onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void,
    onChangeRowsPerPage: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

const GenericTable = function <T>(props: GenericTableProps<T> & { children?: ReactNode }) {
    const { classes, headerProps, bodyProps, paginationProps, toolbarProps } = props;
    console.log({ props })
    const isPaginated = !!paginationProps && Object.keys(paginationProps).length > 0
    console.log({ isPaginated })

    const buildPagination = () => {
        console.log(isPaginated)
        // if (isPaginated) {
        //     return <TablePagination {...paginationProps} />
        // }
    }

    const buildTable = () => {
        console.log({ paginationProps })
        return <TableContainer>
            <GenericTableToolbar {...toolbarProps} />
            {buildPagination()}
            <Table
                className={classes?.table}
                aria-labelledby="tableTitle"
                aria-label="enhanced table"
                size={classes.dense ? 'small' : 'medium'}
            >
                <GenericTableHead<T>
                    {...headerProps}
                />
                <GenericTableBody<T>
                    {...bodyProps}
                />
            </Table>
            {buildPagination()}
        </TableContainer >
    }

    return buildTable();

}

export default GenericTable;