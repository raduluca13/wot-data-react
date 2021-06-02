import { createStyles, makeStyles, Theme, Tooltip, withStyles } from '@material-ui/core';
import React, { ChangeEvent, MouseEvent, MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProvincesThunk, globalMapStateSelector, Province } from '../../slices/globalMapSlice';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { getComparator, Order, stableSort } from '../../utils/generic-table/genericTableUtils';
import CompetitorsTooltip from './CompetitorsTooltip';
import GenericTable, { GenericTablePaginationProps } from '../../components/GenericTable';
import { GenericTableHeadProps, HeadCell } from '../../components/GenericTableHead'
import { GenericTableBodyProps } from '../../components/GenericTableBody'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        provincesContainer: {
            margin: theme.spacing(1),
            // display: "flex",
            // flexDirection: "column"
        },
        searchInput: {
            marginBottom: "2rem"
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }),
);


// type ProvinceKeys = keyof Province[]
function getKeys<T>(someObj: T): (keyof T)[] {
    return Object.keys(someObj) as (keyof T)[]
}

const Provinces = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const columns: (keyof Province)[] = getKeys<Province>(new Province())

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Province>('prime_time');
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(100);

    const buildProvinceHeadCells = () => {
        return columns.map((column: keyof Province) => {
            return {
                disablePadding: false,
                id: column,
                label: column.split("_").join(" "),
                numeric: false
            } as HeadCell<Province>
        })
    }

    const HtmlTooltip = withStyles((theme: Theme) => ({
        tooltip: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }))(Tooltip);

    const provinceRowCellsMapper = (labelId: string, row: Province): (value: keyof Province, index: number, array: (keyof Province)[]) => JSX.Element => {
        return column => {
            if ((column === "competitors" || column === "attackers") && row[column].length > 0) {
                return <HtmlTooltip
                    placement="right"
                    arrow
                    title={
                        <CompetitorsTooltip
                            clanIds={row[column]}
                            provinceId={row["province_id"]} />
                    }
                >
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row[column].length}
                    </TableCell>
                </HtmlTooltip>
            }
            if (column === "owner_clan_id") {
                return <HtmlTooltip
                    arrow
                    placement="right"
                    title={
                        <CompetitorsTooltip
                            clanIds={[row[column]]}
                            provinceId={row["province_id"]} />
                    }
                >
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row[column]}
                    </TableCell>
                </HtmlTooltip>
            }

            if (column === "battles_start_at") {
                return <TableCell component="th" id={labelId} scope="row" padding="none">
                    {row[column].split("T")[1]}
                </TableCell>
            }
            if (column === "active_battles") {
                return <TableCell></TableCell>
            }

            return <TableCell component="th" id={labelId} scope="row" padding="none">
                {row[column]}
            </TableCell>
        }
    }

    const { provincesFetchStatus, provincesFetchErrors, provinces } = useSelector(globalMapStateSelector)
    const [provinceTableHeadCells, setProvinceTableHeadCells] = useState(buildProvinceHeadCells() as HeadCell<Province>[])
    const [localProvinces, setLocalProvinces] = useState([] as Province[])
    // only first time
    useEffect(() => {
        if (provincesFetchStatus === 'idle') {
            dispatch(fetchProvincesThunk())
        }
    }, [])

    useEffect(() => {
        if (provinces && provinces.length > 0) {
            setLocalProvinces(provinces)
        }
    }, [provinces])


    // -------------TBD-------------
    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof Province) => {
        console.log({ event }, { property })
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            // const newSelecteds = provinces.map((province) => province.province_name);
            setSelected(Array.from({ length: provinces.length }, (x, i) => i));
            return;
        }
        setSelected([]);
    };

    const handleRowClick = (index: number, page: number, rowsPerPage: number) => {
        const paginatedItemIndex = page * rowsPerPage + index
        const selectedIndex = selected.indexOf(paginatedItemIndex);
        if (selectedIndex === -1) {
            setSelected(selected => {
                const newSelected = [...selected, paginatedItemIndex]
                return newSelected
            })
            return;
        }

        setSelected(selected => {
            const newSelected = [...selected]
            newSelected.splice(selectedIndex, 1)
            return newSelected
        })
    }

    const handleChangePage = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }, [page]);

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const emptyRows = useCallback(() => rowsPerPage - Math.min(rowsPerPage, provinces.length - page * rowsPerPage), [rowsPerPage, provinces, page]);
    // -------------END TBD-------------

    const buildTableWithPagination = () => {
        if (localProvinces.length > 0) {
            const tableRowsSorted = stableSort<Province>(localProvinces, getComparator<Province>(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

            const provinceTableProps = {
                classes: classes as ReturnType<typeof useStyles>,
                paginationEnabled: true,
                headerProps: {
                    headCells: provinceTableHeadCells,
                    classes: classes,
                    numSelected: selected.length,
                    order: order,
                    orderBy: orderBy,
                    onSelectAllClick: handleSelectAllClick,
                    onRequestSort: handleRequestSort,
                    rowCount: localProvinces.length,
                } as GenericTableHeadProps<Province>,
                bodyProps: {
                    rows: tableRowsSorted,
                    columns: columns,
                    selectedIndexes: selected,
                    page: page,
                    rowsPerPage: rowsPerPage,
                    rowCellsMapper: provinceRowCellsMapper,
                    onRowClick: handleRowClick
                } as GenericTableBodyProps<Province>,
                paginationProps: {
                    rowsPerPageOptions: [5, 10, 25, 50, 100],
                    component: "div",
                    count: provinces.length ?? 0,
                    rowsPerPage: rowsPerPage,
                    page: page,
                    onChangePage: handleChangePage,
                    onChangeRowsPerPage: handleChangeRowsPerPage
                } as GenericTablePaginationProps<Province>,
                toolbarProps: {
                    numSelected: selected.length,
                    title: 'Provinces'
                }
            }
            return <GenericTable<Province> {...provinceTableProps} />
        }

    }

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, [rowsPerPage, page]);


    return <div className={classes.provincesContainer}>
        <Paper className={classes.paper}>
            {buildTableWithPagination()}
        </Paper>
        <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
        />
    </div>
}

export default Provinces;