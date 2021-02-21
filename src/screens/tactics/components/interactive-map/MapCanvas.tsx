import React from 'react'
import useCanvas from './useCanvas'

type MapCanvasProps = {
    draw: Function,
}

const MapCanvas = (props: MapCanvasProps) => {
    const { draw, ...rest } = props
    const canvasRef = useCanvas(draw)

    return <canvas ref={canvasRef} {...props}></canvas>
}

export default MapCanvas