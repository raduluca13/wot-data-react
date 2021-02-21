import { makeStyles, Theme, createStyles } from '@material-ui/core';
import React, { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinRoomThunk, roomSelector, roomStateSelector } from '../../../../slices/roomSlice';
import { selectedMapSelector, createMapImageUrl, positionListSelector, addTacticPosition } from '../../store/tacticsSlice';
import MapTools from './MapTools';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import MapCanvas from './MapCanvas';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mapContainer: {
            display: "flex"
        },
        map: {
            display: "block",
            width: 400,
            height: 400,
            margin: "0 0",
            backgroundSize: 400,
            backgroundImage: (props: any) => props["image"] ?? "",
            backgroundRepeat: (props: any) => props["repeat"] ?? "",
        }
    }),
);

export interface Point {
    x: number;
    y: number;
}

// TODO - will be extended with icons and labels and so on
export type Coordinates = Point[]

const InteractiveMap = () => {
    const map = useRef(document.createElement("CANVAS") as HTMLCanvasElement)
    console.log({ map })
    const { room, usersInRoom, hasConnectionErrors, connectionStatus } = useSelector(roomStateSelector);
    const positionList = useSelector(positionListSelector);
    console.log({ positionList })
    const selectedMap = useSelector(selectedMapSelector);
    const dispatch = useDispatch();
    const SIZE = 400;
    const MARGIN_PROCENT = 10; // TODO - how you keep this with container's 10%? it should remain as is, but connect the values somehow

    const [mapImageUrl, setMapImageUrl] = useState("");
    const [isMovingEnabled, setIsMovingEnabled] = useState(false);
    const [isMovableAction, setIsMovableAction] = useState(false);
    const classes = useStyles({
        image: `url('${mapImageUrl}')`,
        repeat: "no-repeat"
    })

    const getOffsetAndScaleFactor = () => {
        const bodyWidth = document.body.clientWidth
        const bodyHeight = document.body.clientHeight
        const OFFSET_TOP = (bodyHeight / MARGIN_PROCENT)
        const OFFSET_LEFT = (bodyWidth / MARGIN_PROCENT)//  + (CONTAINER_WIDTH - SIZE) / 2  ----- this is for center alignment on X-axis
        const SCALE_FACTOR = bodyWidth / bodyHeight

        return {
            OFFSET_TOP,
            OFFSET_LEFT,
            SCALE_FACTOR
        }
    }

    const drawPositionList = useCallback(() => {
        const canvas = map.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            if (positionList.length === 0) {
                ctx.clearRect(0, 0, SIZE, SIZE);
                return;
            }
            positionList.forEach((point: Point) => {
                ctx.beginPath();
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(point.x, point.y, 5, 5);
                ctx.fill();
            })
        }
    }, [positionList])

    // useEffect(() => {
    //     if (room === undefined || connectionStatus === "idle") {
    //         dispatch(joinRoomThunk())
    //     }
    // }, [positionList, room, connectionStatus])

    useEffect(() => {
        if (selectedMap != null) {
            const newMapImg = createMapImageUrl(selectedMap.arena_id);
            setMapImageUrl(newMapImg);
        }
    }, [selectedMap, mapImageUrl])

    useEffect(() => {
        if (!!mapImageUrl && positionList.length > 0) {
            drawPositionList()
        }
    }, [mapImageUrl, positionList, drawPositionList])


    const onMouseMove = useCallback((event) => {
        const { OFFSET_TOP, OFFSET_LEFT, SCALE_FACTOR } = getOffsetAndScaleFactor()
        if (map && map.current) {
            const canvas = map.current as HTMLCanvasElement
            const ctx = canvas.getContext('2d');
            canvas.width = SIZE;
            canvas.height = SIZE;
            // const CONTAINER_WIDTH = canvas.parentElement?.clientWidth ?? 0;
            if (ctx) {
                const x = event.clientX - OFFSET_LEFT;
                const y = event.clientY - SCALE_FACTOR * OFFSET_TOP;
                const coord = { x, y } as Point;
                dispatch(addTacticPosition(coord))
            }
        }

        if (isMovingEnabled) {
            console.log("move")
            console.log(event.target);
        }
    }, [dispatch, isMovingEnabled]);

    const onMouseDown = useCallback((event) => {
        const { OFFSET_TOP, OFFSET_LEFT, SCALE_FACTOR } = getOffsetAndScaleFactor()
        const canvas = map.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");
        canvas.width = SIZE;
        canvas.height = SIZE;
        // const CONTAINER_WIDTH = canvas.parentElement?.clientWidth ?? 0;
        if (ctx) {
            const x = event.clientX - OFFSET_LEFT;
            const y = event.clientY - SCALE_FACTOR * OFFSET_TOP;
            const coord = { x, y } as Point;
            dispatch(addTacticPosition(coord))
        }

        if (isMovableAction) {
            // set isMovable when user picks some tool.. not yet
            setIsMovingEnabled(true);
        }
    }, [dispatch, isMovableAction]);

    const onMouseUp = useCallback((event) => {
        setIsMovingEnabled(false);
    }, []);

    const draw = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.arc(50, 100, 20, 0, 2 * Math.PI)
        ctx.fill()
    }

    return <div className={classes.mapContainer}>
        <MapCanvas draw={draw} />
        <canvas
            ref={map}
            className={classes.map}
            onMouseDown={onMouseDown}
            // onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        ></canvas>
        <MapTools />
    </div>
}

export default InteractiveMap;