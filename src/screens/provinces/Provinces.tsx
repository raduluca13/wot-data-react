import { createStyles, makeStyles, Theme, Tooltip, Typography, withStyles } from '@material-ui/core';
import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProvincesThunk, globalMapStateSelector, Province } from '../../slices/globalMapSlice';
import ProvinceComponent from './ProvinceComponent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { getComparator, Order, stableSort } from '../../utils/generic-table/genericTableUtils';
import GenericTableToolbar from '../../components/GenericTableToolbar';
import GenericTableHead, { HeadCell } from '../../components/GenericTableHead';
import Button from '@material-ui/core/Button';
import CompetitorsTooltip from './CompetitorsTooltip';
import { clanListFetchSelector, fetchClanListThunk } from '../../slices/clanSlice';

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


type ProvinceKeys = Array<keyof Province>
function getKeys<T>(someObj: T): string[] {
    return Object.keys(someObj) as ProvinceKeys
}

const Provinces = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const columns = getKeys<Province>(new Province()) as ProvinceKeys

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Province>('prime_time');
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(100);

    const buildProvinceHeadCells = () => {
        return columns.map(column => {
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

    const buildRowCells = (labelId: string, row: Province): (value: keyof Province, index: number, array: (keyof Province)[]) => JSX.Element => {
        return column => {
            if (column === "competitors" || column === "attackers" && row[column].length > 0) {
                return <HtmlTooltip
                    placement="right"
                    arrow
                    title={
                        <CompetitorsTooltip clanIds={row[column]} />
                    }
                >
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row[column].join("\r\n")}
                    </TableCell>
                </HtmlTooltip>
            }
            if (column === "owner_clan_id") {
                return <HtmlTooltip
                    arrow
                    placement="right"
                    title={
                        <CompetitorsTooltip clanIds={[row[column]]} />
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
            if (column === "active_battles") { return <TableCell></TableCell> }

            return <TableCell component="th" id={labelId} scope="row" padding="none">
                {row[column]}
            </TableCell>
        }
    }

    const { provincesFetchStatus, provincesFetchErrors, provinces } = useSelector(globalMapStateSelector)
    const [provinceTableHeadCells, setProvinceTableHeadCells] = useState(buildProvinceHeadCells() as HeadCell<Province>[])
    const [localProvinces, setLocalProvinces] = useState([] as Province[])
    const { clanList, clanListFetchStatus, clanListFetchErrors } = useSelector(clanListFetchSelector)
    // only first time
    useEffect(() => {
        if (provincesFetchStatus === 'idle') {
            dispatch(fetchProvincesThunk())
        }

        if (clanListFetchStatus === 'idle') {
            dispatch(fetchClanListThunk())
        }
    }, [])

    useEffect(() => {
        if (provinces && provinces.length > 0) {
            setLocalProvinces(provinces)
        }

        console.log({ clanList })
    }, [provinces, clanList])


    // -------------TBD-------------
    const handleRequestSort = (event: MouseEvent<unknown>, property: keyof Province) => {
        console.log({ event }, { property })
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = provinces.map((province) => province.province_name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    const handleClick = useCallback((event: MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        console.log({ selectedIndex })
        if (selectedIndex === -1) {
            setSelected([...selected, name])
            return;
        }

        if (selectedIndex === 0) {
            setSelected([...selected.slice(1)]);
            return;
        }
        if (selectedIndex === selected.length - 1) {
            setSelected([...selected.slice(0, -1)]);
            return;
        }
        if (selectedIndex > 0) {
            setSelected([
                ...selected.slice(0, selectedIndex),
                ...selected.slice(selectedIndex + 1),
            ])
        }
    }, [selected]);
    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        console.log({ event }, { newPage })
        setPage(newPage);
    }, [page]);
    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, [rowsPerPage, page]);
    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };
    const isSelected = useCallback((name: string) => selected.indexOf(name) !== -1, [selected]);
    const emptyRows = useCallback(() => rowsPerPage - Math.min(rowsPerPage, provinces.length - page * rowsPerPage), [rowsPerPage, provinces, page]);
    // -------------END TBD-------------

    const buildTableHead = () => {
        return <GenericTableHead<Province>
            headCells={provinceTableHeadCells}
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={localProvinces.length}
        />
    }

    const buildTableBody = () => {
        console.log({ page }, { rowsPerPage }, { selected }, { localProvinces })
        if (localProvinces.length > 0) {
            return stableSort<Province>(localProvinces, getComparator<Province>(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                    const isItemSelected = isSelected(row.province_name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                        <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.province_name)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.province_id}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={isItemSelected}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </TableCell>
                            {columns.map(buildRowCells(labelId, row))}
                        </TableRow>
                    );
                })
        }
    }

    return <div className={classes.provincesContainer}>
        <Paper className={classes.paper}>
            <GenericTableToolbar numSelected={selected.length} />
            <TableContainer>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                    aria-label="enhanced table"
                >
                    {buildTableHead()}
                    <TableBody>
                        {buildTableBody()}
                        {emptyRows() > 0 && (
                            <TableRow style={{ height: (dense ? 33 : 53) * emptyRows() }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={provinces.length ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
        <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
        />
    </div>
}

export default Provinces;