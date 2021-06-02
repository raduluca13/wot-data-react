import React from 'react'
import { Point } from '../../../../slices/mapInteractionSlice'
import { TankType } from '../../../vehicles/types'
import { MapTool } from './MapTools'
import useCanvas, { UseCanvasProps } from './useCanvas'



const _predraw = (context: CanvasRenderingContext2D) => { }
const _postdraw = () => { }

const MapCanvas = (props: UseCanvasProps) => {
    const { draw, preDraw = _predraw, postDraw = _postdraw, styles, /*onMouseDown, onMouseMove, onMouseUp, */ markers, cursorPosition } = props
    const canvasRef = useCanvas(props)

    return <canvas
        className={styles}
        ref={canvasRef}
    // onMouseUp={onMouseUp}
    // onMouseDown={onMouseDown}
    // onMouseMove={onMouseMove}
    ></canvas>
}

export default MapCanvas