import {
    makeStyles,
    MenuItem,
    Theme,
    createStyles,
    Button,
    FormControl,
    FormGroup,
    InputLabel,
    Select
} from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import NearMeIcon from '@material-ui/icons/NearMe';
import { useDispatch, useSelector } from 'react-redux';
import { MarkerType, setActiveTool } from '../../../../slices/mapInteractionSlice';
import { WoTMap } from '../../../../store/types/interfaces/WoTMap.interface';
import { mapsApiStateSelector } from '../../../../slices/mapsApiSlice';
import { WebSocketContext } from '../../../../WebSocketContext';

export interface MapTool {
    tankTool?: MarkerType,
    cursorTool?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tools: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
        },
        tool: {
            color: (props: any) => props["cursorActive"] ? theme.palette.secondary.dark : theme.palette.primary.dark,
        },
        iconMedium: {
            height: 60,
            width: 60,
            color: (props: any) => props["activeTool"] === "mediumTank" ? theme.palette.secondary.dark : theme.palette.primary.dark,
        },
        iconHeavy: {
            height: 60,
            width: 60,
            color: (props: any) => props["activeTool"] === "heavyTank" ? theme.palette.secondary.dark : theme.palette.primary.dark,
        },
        buttonHeavy: {
            disabled: (props: any) => props["activeTool"] === "heavyTank" ? "true" : "false",
            color: (props: any) => props["activeTool"] === "heavyTank" ? theme.palette.secondary.dark : theme.palette.primary.dark,
        },
        buttonMedium: {
            disabled: (props: any) => props["activeTool"] === "mediumTank" ? "true" : "false",
            color: (props: any) => props["activeTool"] === "heavyTank" ? theme.palette.secondary.dark : theme.palette.primary.dark,
        }
    }),
);

const MapTools = () => {
    const webSocketContext = useContext(WebSocketContext)
    const { maps, mapFetchError, mapFetchStatus, selectedMap } = useSelector(mapsApiStateSelector)
    const classes = useStyles({ activeTool: "", cursorActive: true });
    const defaultMapSelection = useMemo(() => <MenuItem key={"NONE-map"} value={"NONE"}>NONE</MenuItem>, [])

    const mapOptions = useMemo(() => {
        return [...maps?.map((map: WoTMap) => {
            return <MenuItem key={map.arena_id} value={map.name_i18n}>
                {map.name_i18n}
            </MenuItem>
        }), defaultMapSelection]

    }, [maps, defaultMapSelection])

    useEffect(() => { console.log({ mapOptions }) }, [mapOptions])

    const onClickHeavyTankTool = useCallback((event) => {
        webSocketContext.socket.emit("selectedToolChanged", JSON.stringify({ tankTool: MarkerType.HEAVY_TANK } as MapTool))
    }, [webSocketContext])

    const onClickMediumTankTool = useCallback((event) => {
        webSocketContext.socket.emit("selectedToolChanged", JSON.stringify({ tankTool: MarkerType.MEDIUM_TANK } as MapTool))
    }, [webSocketContext])

    const onClickCursorTool = useCallback((event) => {
        webSocketContext.socket.emit("selectedToolChanged", JSON.stringify({ cursorTool: true } as MapTool))
    }, [webSocketContext])

    const onClearMap = useCallback((event) => {
        webSocketContext.socket.emit("clearedMarkers")
    }, [webSocketContext])

    const onClickSavePositions = useCallback((event) => {
        // dispatch(saveTacticPositions(positionList));
    }, [webSocketContext]);

    const onChangeMap = useCallback((event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        const message = JSON.stringify(event.target.value)
        webSocketContext.socket.emit("mapChanged", message)
        console.log({ message })
    }, [webSocketContext])


    const renderFormGroup = () => {
        return <FormGroup>
            <FormControl>
                <InputLabel id="map-form-control">Map</InputLabel>
                <Select
                    labelId="map-form-control"
                    value={selectedMap.name_i18n}
                    onChange={onChangeMap}
                >
                    {mapOptions}
                </Select>
            </FormControl>
        </FormGroup>
    }

    return <div className={classes.tools}>
        {/* TODO - create actions enum and create html dynamically*/}
        {renderFormGroup()}
        <Button className={classes.tool} variant="outlined" onClick={onClickCursorTool}>
            <NearMeIcon />
        </Button>
        <Button className={classes.tool} variant="outlined" onClick={onClickSavePositions}>
            Save
            </Button>
        <Button className={classes.tool} variant="outlined" onClick={onClearMap}>
            Clear
        </Button>
        <Button className={classes.buttonHeavy} variant="outlined" onClick={onClickHeavyTankTool}>
            <img className={classes.iconHeavy} src="https://na-wotp.wgcdn.co/dcont/fb/image/heavy_tank_icon_s.png" />
        </Button>
        <Button className={classes.buttonMedium} variant="outlined" onClick={onClickMediumTankTool}>
            <img className={classes.iconMedium} src="https://na-wotp.wgcdn.co/dcont/fb/image/medium_tank_icon_s.png" />
        </Button>
    </div>
}

export default MapTools;