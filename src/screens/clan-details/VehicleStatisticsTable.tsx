import { Checkbox, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core"
import React, { useCallback, useState } from "react"
import GenericTable, { GenericTablePaginationProps } from "../../components/GenericTable"
import { GenericTableBodyProps } from "../../components/GenericTableBody"
import GenericTableHead, { GenericTableHeadProps, HeadCell } from "../../components/GenericTableHead"
import { getComparator, Order, stableSort } from "../../utils/generic-table/genericTableUtils"
import { BasicTankStatistics, Statistic, StatisticKey, StrongholdBattlesTankStatistics, StrongholdBattlesTankStatisticsKey, TankCompanyBattlesTankStatistics, TankCompanyBattlesTankStatisticsKey, TankStatistics } from "../vehicles/types"

export function getKeys<T>(someObj: T): Array<keyof T> {
    return Object.keys(someObj) as any as Array<keyof T>
}

export function getEntries<T>(obj: T): Entries<T> {
    return Object.entries(obj) as any;
}

export type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

// function getEntries<T>(someObj: T): [keyof T, T[keyof T]] {
//     return Object.entries(someObj) as [keyof T, T[keyof T]]
// }

const VehicleStatisticsTable = () => {
    const [order, setOrder] = useState<Order>('asc');

    // const buildTable = () => {
    //     switch (key) {
    //         case "company": {
    //             const columns = getKeys<TankCompanyBattlesTankStatistics>(new TankCompanyBattlesTankStatistics()) as TankCompanyBattlesTankStatisticsKey[]
    //             const headCells = columns.map((column: TankCompanyBattlesTankStatisticsKey) => {
    //                 return {
    //                     disablePadding: false,
    //                     id: column,
    //                     label: column.split("_").join(" "),
    //                     numeric: false
    //                 } as HeadCell<TankCompanyBattlesTankStatistics>
    //             })
    //             return <p></p>
    //         }
    //         case "globalmap": {
    //             return <p></p>
    //         }
    //         case "stronghold_defense": {
    //             return <p></p>
    //         }
    //         case "stronghold_skirmish": {
    //             const orderBy = "battles"
    //             console.log(statistics[1] as StrongholdBattlesTankStatistics)

    //             return buildSkirmishTable(order, orderBy)
    //         }
    //         case "ranked_battles": {
    //             return <p></p>
    //         }
    //         default:
    //             return <p></p>
    //     }
    // }

    // return <div>{buildTable()}</div>
    return <p></p>
}


export default VehicleStatisticsTable

const buildSkirmishTable = (order: Order, orderBy: StrongholdBattlesTankStatisticsKey) => {
    const battleTypeKeys = getKeys<StrongholdBattlesTankStatistics>(new StrongholdBattlesTankStatistics()) as unknown as StrongholdBattlesTankStatisticsKey[]
    const headCells = battleTypeKeys.map((battleTypeKey: StrongholdBattlesTankStatisticsKey) => {
        return {
            disablePadding: false,
            id: battleTypeKey,
            label: battleTypeKey.split("_").join(" "),
            numeric: false
        } as HeadCell<StrongholdBattlesTankStatistics>
    })
    const tableRowsSorted = stableSort<StrongholdBattlesTankStatistics>([], getComparator<StrongholdBattlesTankStatistics>(order, orderBy))

    return <p></p>

    // const skirmishTableProps = {
    //     classes: classes as ReturnType<typeof useStyles>,
    //     headerProps: {
    //         headCells: provinceTableHeadCells,
    //         classes: classes,
    //         numSelected: selected.length,
    //         order: order,
    //         orderBy: orderBy,
    //         onSelectAllClick: handleSelectAllClick,
    //         onRequestSort: handleRequestSort,
    //         rowCount: localProvinces.length
    //     } as GenericTableHeadProps<StrongholdBattlesTankStatistics>,
    //     bodyProps: {
    //         rows: tableRowsSorted,
    //         columns: columns,
    //         selectedRows: selected,
    //         rowCellsMapper: provinceRowCellsMapper,
    //         onRowClick: handleRowClick
    //     } as GenericTableBodyProps<StrongholdBattlesTankStatistics>,
    //     paginationProps: {
    //         rowsPerPageOptions: [5, 10, 25, 50, 100],
    //         component: "div",
    //         count: provinces.length ?? 0,
    //         rowsPerPage: rowsPerPage,
    //         page: page,
    //         onChangePage: handleChangePage,
    //         onChangeRowsPerPage: handleChangeRowsPerPage
    //     } as GenericTablePaginationProps<StrongholdBattlesTankStatistics>,
    //     toolbarProps: {
    //         numSelected: selected.length
    //     }
    // }

    // return <GenericTable<StrongholdBattlesTankStatistics> {...skirmishTableProps} />
}
