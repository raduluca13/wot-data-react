import classes from '*.module.css';
import { Box } from '@material-ui/core';
import React, { createRef, useEffect, useRef, useState } from 'react';
import GenericTable, { GenericTablePaginationProps } from '../../components/GenericTable';
import { GenericTableBodyProps } from '../../components/GenericTableBody';
import { GenericTableHeadProps, HeadCell } from '../../components/GenericTableHead';
import { Province } from '../../slices/globalMapSlice';
import { TankStatistics, Vehicle } from '../vehicles/types';

// make it generic ?? nah.. overhead for now
export type TabController = {
    index: number;
    key: keyof TankStatistics
}

export type UseTabsProps = {
    selectedTab: TabController,
    index: number,
    handleChange: Function,
}

export type TankAndStatistics = {
    tank: Vehicle,
    tankStatistics: TankStatistics
}


interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const useTabPanels = (props: { selectedTab: TabController, tabsMap: Map<string, Map<any, any>> }) => {
    /* @returns Map<tankName, Map<statisticName, statisticValue>> */
    const { selectedTab, tabsMap } = props
    const tabMap = new Map([])
    let headerCellColumns: any[] = []
    // const [currentTabName, setCurrentTabName] = useState("")
    tabsMap.forEach((value: Map<any, any>, key: any) => {
        const statValue = value.get(selectedTab.key)
        headerCellColumns = Object.keys(statValue) // redundant to assign so many times..
        console.log(Object.keys(statValue))
        console.log({ headerCellColumns })
        tabMap.set(key, statValue)
    })

    console.log({ headerCellColumns })
    useEffect(() => {
        buildTabPanel();
    }, [])

    const buildTabPanel = () => {
        const buildTableHeadCells = () => {
            console.log({ tabsMap }, { tabMap }, selectedTab.key)

            // return columns.map((column: keyof Province) => {
            //     return {
            //         disablePadding: false,
            //         id: column,
            //         label: column.split("_").join(" "),
            //         numeric: false
            //     } as HeadCell<Province & "TANK NAME">
            // })
        }
        buildTableHeadCells();

        // const provinceTableProps = {
        //     paginationEnabled: true,
        //     headerProps: {
        //         headCells: provinceTableHeadCells,
        //         classes: classes,
        //         numSelected: selected.length,
        //         order: order,
        //         orderBy: orderBy,
        //         onSelectAllClick: handleSelectAllClick,
        //         onRequestSort: handleRequestSort,
        //         rowCount: localProvinces.length,
        //     } as GenericTableHeadProps<Province>,
        //     bodyProps: {
        //         rows: tableRowsSorted,
        //         columns: columns,
        //         selectedRows: selected,
        //         rowCellsMapper: provinceRowCellsMapper,
        //         onRowClick: handleRowClick
        //     } as GenericTableBodyProps<Province>,
        //     paginationProps: {
        //         rowsPerPageOptions: [5, 10, 25, 50, 100],
        //         component: "div",
        //         count: provinces.length ?? 0,
        //         rowsPerPage: rowsPerPage,
        //         page: page,
        //         onChangePage: handleChangePage,
        //         onChangeRowsPerPage: handleChangeRowsPerPage
        //     } as GenericTablePaginationProps<Province>,
        //     toolbarProps: {
        //         numSelected: selected.length,
        //         title: 'Provinces'
        //     }
        // }

        return <TabPanel value={selectedTab.index} index={selectedTab.index + 1}>
            {/* <GenericTable<any> {...tableProps} >
            </GenericTable> */}
        </TabPanel>
    }

    return <div></div>
}

export default useTabPanels;


