import { useRef, useEffect } from 'react'

const useCanvas = (draw: Function) => {
    const canvasRef = useRef(document.createElement("canvas") as HTMLCanvasElement)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        const render = () => {
            draw(context)
        }

        render()
    }, [draw])

    return canvasRef
}

export default useCanvas