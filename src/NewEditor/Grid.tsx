import React, { useState } from "react"
import { Size } from "../types"

type GridProps = {
  grid?: boolean | { size: number }
  componentSize: Size
  pattern?: HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas
}

/**
 * Set default pattern for background
 */
const defaultPattern = (): HTMLCanvasElement => {
  const patternCanvas = document.createElement('canvas')
  const patternContext = patternCanvas.getContext('2d')
  patternCanvas.width = 24
  patternCanvas.height = 24
  // patternContext.fillStyle = "#f2f2f2"
  patternContext.fillRect(0, 0, patternCanvas.width / 2, patternCanvas.height / 2)
  patternContext.fillStyle = '#fec'
  patternContext.stroke()
  return patternCanvas
}

export const Grid: React.FC<GridProps> = (props) => {
  const [gridSize, setGridSize] = useState<Size>(undefined)

  const { width, height } = props.componentSize

  const draw = (element: HTMLCanvasElement) => {
    if (element === null) return

    if (gridSize !== undefined && gridSize.height === height && gridSize.width === width) return

    setGridSize({ height, width })
    const ctx = element.getContext("2d")
    ctx.clearRect(0, 0, element.width, element.height)
    ctx.beginPath()

    const currentPattern = props.pattern || defaultPattern()
    console.log('44', currentPattern, gridSize?.width || 0, gridSize?.height || 0)
    ctx.fillStyle = ctx.createPattern(currentPattern, 'repeat')
    ctx.fillRect(0, 0, gridSize?.width || 0, gridSize?.height || 0)
    ctx.stroke()
  }

  return <canvas className="grid" width={width} height={height} ref={draw} />
}
