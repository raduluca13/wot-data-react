import { useRef, useEffect } from 'react'
import { MapMarker, MarkerType, Point } from '../../../../slices/mapInteractionSlice'
import { MapTool } from './MapTools'

export interface UseCanvasProps {
    draw?: Function,
    preDraw?: Function,
    postDraw?: Function,
    onMouseDown: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void,
    onMouseUp: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void,
    onMouseMove: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void,
    markers?: MapMarker[],
    cursorPosition?: Point,
    activeTool: MapTool,
    styles?: string
}


const useCanvas = (props: UseCanvasProps) => {
    console.log("canvas init with props: ", props)
    const MARGIN_PROCENT = 10;
    const SIZE = 400;
    const canvasElement = document.createElement("canvas")
    canvasElement.width = SIZE;
    canvasElement.height = SIZE;
    const canvasRef = useRef<HTMLCanvasElement>(canvasElement)
    const { markers, cursorPosition, activeTool } = props

    let currentRadius = 5;
    const endRadius = 20;

    const drawMarkers = (context: CanvasRenderingContext2D) => {
        // const canvas = canvasRef.current as HTMLCanvasElement;
        // canvas.height = canvas.width = SIZE;
        console.log("drawing markers ", { markers })
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
                context.drawImage(img, marker.x-12, marker.y-10, 20, 20);
                // context.fillRect(marker.x, marker.y, 5, 5);
                context.fill();
                context.stroke();
            })
        }
    }

    const drawPoint = (context: CanvasRenderingContext2D) => {
        if (context) {
            context.clearRect(0, 0, SIZE, SIZE);

            if (cursorPosition && cursorPosition.x && cursorPosition.y) {
                context.beginPath();
                context.fillStyle = "#FF0000";
                context.arc(cursorPosition.x, cursorPosition.y, 10, 0 * Math.PI, 2 * Math.PI)
                context.fill();
                context.stroke()

                // animate(context, cursorPosition, currentRadius)
                return;
            }
        }
    }

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
        const canvas = canvasRef.current
        canvas.width = 400;
        canvas.height = 400;
    }, [])

    useEffect(() => {
        console.log(canvasRef.current.width, canvasRef.current.height)
        const context = canvasRef.current.getContext('2d')

        const render = (context: CanvasRenderingContext2D) => {
            context.clearRect(0, 0, SIZE, SIZE)

            drawMarkers(context)

            if (activeTool.cursorTool) {
                drawPoint(context)
            }
        }

        if (context) {
            render(context)
        }
    }, [drawPoint, drawMarkers, canvasRef, markers, cursorPosition, activeTool])


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