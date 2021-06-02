import { makeStyles, Theme, createStyles, MenuItem } from '@material-ui/core';
import React, { createRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    createMapImageUrl,
    allMapsSelector,
} from '../../store/tacticsSlice';
import MapTools, { MapTool } from './MapTools';
import { WebSocketContext } from '../../../../WebSocketContext';
import { addMarker, cursorPositionSelector, MapMarker, markersSelector, Point, selectedToolSelector } from '../../../../slices/mapInteractionSlice';
import useCanvas from './useCanvas';
import { WoTMap } from '../../../../store/types/interfaces/WoTMap.interface';
import { fetchMapsThunk, mapsApiStateSelector, selectedInteractiveMapSelector } from '../../../../slices/mapsApiSlice';
import MapCanvas from './MapCanvas';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mapContainer: {
            display: "flex",
            cursor: (props: any) => props["isCursorDisplayed"] ? "inherit" : "none"
        },
        map: {
            display: "block",
            width: 400,
            height: 400,
            margin: "0 0",
            border: "1px solid blue",
            backgroundSize: 400,
            backgroundImage: (props: any) => props["image"] ?? "",
            backgroundRepeat: (props: any) => props["repeat"] ?? "",
        }
    }),
);


const InteractiveMap = () => {
    const dispatch = useDispatch();
    const webSocketContext = useContext(WebSocketContext);

    const { mapFetchError, mapFetchStatus, maps } = useSelector(mapsApiStateSelector)
    const cursorPosition = useSelector(cursorPositionSelector);
    const markers = useSelector(markersSelector);
    const selectedMap = useSelector(selectedInteractiveMapSelector);
    const activeTool = useSelector(selectedToolSelector);

    const SIZE = 400;
    const MARGIN_PROCENT = 10; // TODO - how you keep this with container's 10%? it should remain as is, but connect the values somehow

    const [isCursorDisplayed, setIsCursorDisplayed] = useState(true)
    const [mapImageUrl, setMapImageUrl] = useState("");
    const [isMovingEnabled, setIsMovingEnabled] = useState(false);

    const classes = useStyles({
        image: `url('${mapImageUrl}')`,
        repeat: "no-repeat",
        isCursorDisplayed
    })

    const getOffsetAndScaleFactor = () => {
        const bodyWidth = document.body.clientWidth
        const bodyHeight = document.body.clientHeight
        // 7.25rem top
        // 1 rem left
        const OFFSET_TOP = 80// (bodyHeight / MARGIN_PROCENT)
        const OFFSET_LEFT = 16// (bodyWidth / MARGIN_PROCENT)//  + (CONTAINER_WIDTH - SIZE) / 2  ----- this is for center alignment on X-axis
        const SCALE_FACTOR = 1 //bodyWidth / bodyHeight

        return {
            OFFSET_TOP,
            OFFSET_LEFT,
            SCALE_FACTOR
        }
    }

    const canvasRef = useCanvas({ cursorPosition, markers, activeTool })


    const onMouseLeave = useCallback((event) => {
        setIsCursorDisplayed(true)
    }, [isCursorDisplayed])

    const onMouseEnter = useCallback((event) => {
        if (isMovingEnabled) {
            // setIsCursorDisplayed(false)
            setIsCursorDisplayed(true)
        }
    }, [isCursorDisplayed, isMovingEnabled])

    const onMouseMove = useCallback((event) => {
        if (!isMovingEnabled) {
            return
        }
        const { OFFSET_TOP, OFFSET_LEFT, SCALE_FACTOR } = getOffsetAndScaleFactor()
        const x = event.clientX - OFFSET_LEFT;
        const y = event.clientY - SCALE_FACTOR * OFFSET_TOP;
        // const coord = { x, y } as Point;
        const coord = { x, y } as Point
        // console.log(`emitted ${coord.x}, ${coord.y}`)
        webSocketContext.socket.emit("cursorPositionChanged", JSON.stringify(coord))
    }, [dispatch, isMovingEnabled, canvasRef]);

    const onMouseDown = useCallback((event) => {
        if (!activeTool) {
            return;
        }

        if (activeTool.cursorTool) {
            if (!isMovingEnabled) {
                setIsMovingEnabled(true);
                return;
            }
        }

        if (activeTool.tankTool) {
            const { OFFSET_TOP, OFFSET_LEFT, SCALE_FACTOR } = getOffsetAndScaleFactor()
            const x = event.clientX - OFFSET_LEFT;
            const y = event.clientY - SCALE_FACTOR * OFFSET_TOP;
            const marker = { x, y, markerType: activeTool.tankTool } as MapMarker;
            // dispatch(addMarker(marker))
            webSocketContext.socket.emit("markerAdded", JSON.stringify(marker))
        }

    }, [dispatch, isMovingEnabled, activeTool]);

    const onMouseUp = useCallback((event) => {
        setIsMovingEnabled(false);
    }, [isMovingEnabled]);



    useEffect(() => {
        if (mapFetchStatus === 'idle') {
            dispatch(fetchMapsThunk())
        }
    }, [dispatch, mapFetchStatus])

    useEffect(() => {
        if (selectedMap != null) {
            const newMapImg = createMapImageUrl(selectedMap.arena_id);
            setMapImageUrl(newMapImg);
        }
    }, [selectedMap])

    useEffect(() => {
        console.log("changed cursorposition ", cursorPosition)
    }, [cursorPosition])


    useEffect(() => {
        console.log("changed markers ", markers)
    }, [markers])

    useEffect(() => {
        console.log("active tool changed")
        if (!activeTool) {
            return
        }

        if (activeTool.cursorTool) {
            setIsMovingEnabled(true)
        }

        if (activeTool.tankTool) {
            setIsMovingEnabled(false)
        }
    }, [activeTool])


    return <div className={classes.mapContainer}>
        <canvas
            className={classes.map}
            ref={canvasRef}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
        ></canvas>
        {/* <MapCanvas
            cursorPosition={cursorPosition}
            draw={() => { }}
            styles={classes.map}
            preDraw={() => { }}
            postDraw={() => { }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            activeTool={activeTool}
            onMouseUp={onMouseUp}
        /> */}
        <MapTools />
    </div>
}

export default InteractiveMap;