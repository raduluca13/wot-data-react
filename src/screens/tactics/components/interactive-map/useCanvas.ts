import { useRef, useEffect, useMemo, createRef, useState } from 'react'
import { MapMarker, MarkerType, Point } from '../../../../slices/mapInteractionSlice'
import { MapTool } from './MapTools'

export interface UseCanvasProps {
    draw?: Function,
    preDraw?: Function,
    postDraw?: Function,
    // onMouseDown: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void,
    // onMouseUp: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void,
    // onMouseMove: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void,
    markers?: MapMarker[],
    cursorPosition?: Point,
    activeTool: MapTool,
    styles?: string
}


const useCanvas = (props: UseCanvasProps) => {
    const [size, setSize] = useState(400)
    const MARGIN_PROCENT = 10;
    let currentRadius = 5;
    const endRadius = 20;

    // const canvasElement = useMemo(() => document.createElement("canvas"), [size])
    // canvasElement.width = size;
    // canvasElement.height = size;
    // const canvasRef = useRef<HTMLCanvasElement>(canvasElement)

    const canvasRef = useMemo(() => createRef<HTMLCanvasElement>(), [props.markers?.length])
    const cursorPosition = useMemo(() => props.cursorPosition, [props.cursorPosition?.x, props.cursorPosition?.y])
    const markers = useMemo(() => props.markers, [props.markers?.length])
    const activeTool = useMemo(() => props.activeTool, [props.activeTool.cursorTool, props.activeTool.tankTool])

    // useEffect(() => { console.log({ cursorPosition }, 'changed') }, [cursorPosition])
    // useEffect(() => { console.log({ markers }, 'changed') }, [markers])
    // useEffect(() => { console.log({ activeTool }, 'changed') }, [activeTool])
    // useEffect(() => { console.log({ canvasElement }, 'changed') }, [canvasElement])
    // useEffect(() => { console.log({ size }, 'changed') }, [size])


    useEffect(() => {
        // console.log({ canvasRef }, 'canvas ref changed')
        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.width = 400;
            canvas.height = 400;
        }
    }, [canvasRef])

    const drawMarkers = useMemo(() => (context: CanvasRenderingContext2D) => {
        // const canvas = canvasRef.current as HTMLCanvasElement;
        // canvas.height = canvas.width = SIZE;
        // console.log("drawing markers ", { markers })
        if (context) {
            // if (markers?.length === 0) {
            //     context.clearRect(0, 0, SIZE, SIZE);
            //     return;
            // }

            markers?.forEach((marker: MapMarker) => {
                const img = document.createElement("img") as HTMLImageElement;
                img.width = 5;
                img.height = 5;

                if (marker.markerType === MarkerType.MEDIUM_TANK) {
                    img.src = 'https://na-wotp.wgcdn.co/dcont/fb/image/medium_tank_icon_s.png';
                }
                if (marker.markerType === MarkerType.HEAVY_TANK) {
                    img.src = 'https://na-wotp.wgcdn.co/dcont/fb/image/heavy_tank_icon_s.png';
                    img.style.zIndex = "0";
                }
                context.beginPath();
                context.fillStyle = "#FF0000";
                context.drawImage(img, marker.x - 12, marker.y - 10, 20, 20);
                // context.fillRect(marker.x, marker.y, 5, 5);
                context.fill();
                context.stroke();
            })
        }
    }, [markers?.length])

    const drawPoint = useMemo(() => (context: CanvasRenderingContext2D) => {
        if (context) {
            context.clearRect(0, 0, size, size);

            if (cursorPosition && cursorPosition.x && cursorPosition.y) {
                context.beginPath();
                context.fillStyle = "#FF0000";
                context.arc(cursorPosition.x, cursorPosition.y, 10, 0 * Math.PI, 2 * Math.PI)
                // context.arc(395, 395, 5, 0 * Math.PI, 2 * Math.PI)
                context.fill();
                context.stroke()
                // animate(context, cursorPosition, currentRadius)
            }
        }
    }, [cursorPosition?.x, cursorPosition?.y])

    // const animate = (context: CanvasRenderingContext2D, cursorPosition: Point, radius: number) => {
    //     currentRadius += 5;

    //     if (currentRadius < endRadius) {
    //         context.clearRect(cursorPosition.x - currentRadius, cursorPosition.y - currentRadius, cursorPosition.x + currentRadius, cursorPosition.y + currentRadius)
    //         context.arc(cursorPosition.x, cursorPosition.y, currentRadius, 0 * Math.PI, 2 * Math.PI)
    //         context.stroke();
    //         requestAnimationFrame(() => {
    //             animate(context, cursorPosition, currentRadius)
    //         });
    //     }
    // }



    useEffect(() => {
        if (canvasRef.current) {
            const render = (context: CanvasRenderingContext2D) => {
                context.clearRect(0, 0, size, size)

                drawMarkers(context)

                if (activeTool.cursorTool) {
                    drawPoint(context)
                }
            }

            const context = canvasRef.current.getContext('2d')
            if (context) {
                render(context)
            }
        }
    }, [drawPoint, drawMarkers, canvasRef, markers, cursorPosition, activeTool, size])


    return canvasRef
}

export default useCanvas

// const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
//     const { width, height } = canvas.getBoundingClientRect()

//     if (canvas.width !== width || canvas.height !== height) {
//         const { devicePixelRatio: ratio = 1 } = window
//         const context = canvas.getContext('2d')
//         canvas.width = width
//         canvas.height = height
//         if (context) {
//             context.scale(ratio, ratio)
//         }
//         return true
//         // here you can return some usefull information like delta width and delta height instead of just true
//         // this information can be used in the next redraw...
//     }

//     return false
// }