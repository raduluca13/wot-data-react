import { makeStyles, Theme, AppBar, Tabs, Tab, TableCell } from "@material-ui/core";
import React from "react"
import {
    SkirmishBattlesTankStatistics,
    TankStatistics,
    User,
} from "../vehicles/types"
import useTabPanels, { TankAndStatistics } from "./useTabPanels";
import { TabController } from "./useTabPanels";
import { getKeys } from "./VehicleStatisticsTable";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        marginBottom: "1rem"
    },
    tankName: {
        width: "250px"
    }
}));


export interface PlayerTankStatisticsTabViewProps {
    tabsMap: Map<any, any>
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const PlayerTankStatisticsTabView = (props: PlayerTankStatisticsTabViewProps) => {
    const classes = useStyles();
    const { tabsMap } = props
    const statisticKeys = getKeys<TankStatistics>(new TankStatistics());
    const [selectedTab, setSelectedTab] = React.useState({ index: 0, key: 'account_id' } as TabController);

    const handleChange = (event: React.ChangeEvent<{}>, newSelectedTab: number) => {
        const currentSelectedTab = { index: newSelectedTab, key: statisticKeys[newSelectedTab] } as TabController
        setSelectedTab(currentSelectedTab);
    };

    const tabs = statisticKeys.map((statisticKey, index) => {
        const tabKey = [statisticKey, index].join('_')
        return <Tab key={tabKey} label={statisticKey} {...a11yProps(index)} />
    })

    const tabPanels = useTabPanels({ selectedTab, tabsMap });

    return <div className={classes.root}>
        <AppBar position="static">
            <Tabs value={selectedTab.index} onChange={handleChange} variant="scrollable" aria-label="simple tabs example">
                {tabs}
            </Tabs>
        </AppBar>
        {tabPanels}
    </div>




    const skirmishStatisticsTableRowCellsMapper = (
        labelId: string,
        row: SkirmishBattlesTankStatistics
    ): (
            value: keyof SkirmishBattlesTankStatistics,
            index: number,
            array: (keyof SkirmishBattlesTankStatistics)[]
        ) => JSX.Element => {
        return column => {
            return <TableCell component="th" id={labelId} scope="row" padding="none">
                {row[column]}
            </TableCell>
        }
    }
}

export default PlayerTankStatisticsTabView



/**
 *  const buildSkirmishStatisticsTabPanel = (statistics: SkirmishBattlesTankStatistics, selectedTab: number, index: number) => {
        const order: Order = 'asc'
        const orderBy: keyof SkirmishBattlesTankStatistics = 'battle_avg_xp';
        const tableRows = stableSort<SkirmishBattlesTankStatistics>([statistics], getComparator<SkirmishBattlesTankStatistics>(order, orderBy))
        const columns: (keyof SkirmishBattlesTankStatistics)[] = getKeys<SkirmishBattlesTankStatistics>(new SkirmishBattlesTankStatistics())

        const headCells = columns.map((column: keyof SkirmishBattlesTankStatistics) => {
            return {
                disablePadding: false,
                id: column,
                label: column.split("_").join(" "),
                numeric: false
            } as HeadCell<SkirmishBattlesTankStatistics>
        })
        const tableProps = {
            classes: classes,
            paginationEnabled: false,
            headerProps: {
                headCells: headCells,
                classes: classes,
                order: order,
                orderBy: orderBy,
                numSelected: 0,
                rowCount: 0
            } as GenericTableHeadProps<SkirmishBattlesTankStatistics>,
            bodyProps: {
                rows: tableRows,
                columns: columns,
                selectedRows: [],
                rowCellsMapper: skirmishStatisticsTableRowCellsMapper,
                onRowClick: () => { }
            } as GenericTableBodyProps<SkirmishBattlesTankStatistics>,
            paginationProps: {} as GenericTablePaginationProps<SkirmishBattlesTankStatistics>,
            toolbarProps: {
                numSelected: 0,
                title: "Skirmish"
            } as GenericTableToolbarProps
        } as GenericTableProps<SkirmishBattlesTankStatistics>
        console.log({ tableProps })

        return (
            <TabPanel value={selectedTab} index={index + 1}>
                <GenericTable<SkirmishBattlesTankStatistics> {...tableProps} >
                </GenericTable>
            </TabPanel>
        )
    }

    const buildStrongholdStatisticsTabPanel = (statistics: SkirmishBattlesTankStatistics, selectedTab: number, index: number) => {
    }

    const buildGlobalMapTankStatisticsTabPanel = (statistics: GlobalMapTankStatistics, selectedTab: number, index: number) => {
        return (
            <TabPanel value={selectedTab} index={index}>
                {statistics.avg_damage_assisted}
            </TabPanel>
        )
    }



    const buildTabPanels = () => {
        // const currentStatistic = statistics[selectedTab] // [0]: key [1]: statistic
        // console.log({currentStatistic})
        const tabPanels = statistics.map((statistic: TankAndStatistics, index: number) => {
            const { tank, tankStatistics } = statistic
            console.log()
            // console.log(statistic[0] as keyof TankStatistics)
            // switch (statistic[0] as keyof TankStatistics) {
            //     case "tank_id":
            //         return buildPrimitiveTabPanel(statistic[1], selectedTab, index + 1)
            //     case "max_frags":
            //         return buildPrimitiveTabPanel(statistic[1], selectedTab, index + 1)
            //     case "max_xp":
            //         return buildPrimitiveTabPanel(statistic[1], selectedTab, index + 1)
            //     case "frags":
            //         return buildPrimitiveTabPanel(statistic[1], selectedTab, index + 1)
            //     case "in_garage":
            //         return buildPrimitiveTabPanel(statistic[1], selectedTab, index + 1)
            //     case "mark_of_mastery":
            //         return buildPrimitiveTabPanel(statistic[1], selectedTab, index + 1)
            //     case "account_id":
            //         return buildPrimitiveTabPanel(statistic[1], selectedTab, index + 1)
            //     case "globalmap":
            //         return buildGlobalMapTankStatisticsTabPanel(statistic[1] as GlobalMapTankStatistics, selectedTab, index)
            //     case "company":
            //         return buildTankCompanyBattlesTankStatisticsTabPanel(statistic[1] as TankCompanyBattlesTankStatistics, selectedTab, index)
            //     case "epic":
            //         return buildEpicBattlesTankStatisticsTabPanel(statistic[1] as EpicBattlesTankStatistics, selectedTab, index)
            //     case "random":
            //         return buildRandomBattlesTankStatisticsTabPanel(statistic[1] as RandomBattlesTankStatistics, selectedTab, index)
            //     case "ranked":
            //         return buildRankedBattlesTankStatisticsTabPanel(statistic[1] as RankedBattlesTankStatistics, selectedTab, index)
            //     case "ranked_battles":
            //         return buildRankedBattlesTankStatisticsTabPanel(statistic[1] as RankedBattlesTankStatistics, selectedTab, index)
            //     case "regular_team":
            //         return buildRegularTeamTankStatisticsTabPanel(statistic[1] as RegularTeamTankStatistics, selectedTab, index)
            //     case "stronghold_defense":
            //         return buildStrongholdStatisticsTabPanel(statistic[1] as StrongholdBattlesTankStatistics, selectedTab, index)
            //     case "stronghold_skirmish":
            //         return buildSkirmishStatisticsTabPanel(statistic[1] as SkirmishBattlesTankStatistics, selectedTab, index)
            //     case "team":
            //         return buildTeamBattlesTankStatisticsTabPanel(statistic[1] as TeamBattlesTankStatistics, selectedTab, index)
            //     case "all":
            // }
        })

        console.log({ tabPanels })

        return tabPanels
    }
 *
 *
 */