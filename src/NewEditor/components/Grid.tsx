import React from "react"
import { gridState } from "../ducks/store"
import { useRecoilValue } from "recoil"

type GridProps = {
  pattern?: HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas
}

/**
 * Set default pattern for background
 */
const defaultPattern = (): HTMLCanvasElement => {
  const patternCanvas = document.createElement("canvas")
  const patternContext = patternCanvas.getContext("2d")
  patternCanvas.width = 24
  patternCanvas.height = 24

  // set Background color
  patternContext.strokeStyle = "#f2f2f2"

  // horizontal line
  patternContext.moveTo(0, 24)
  patternContext.lineTo(24, 24)

  // vertical line
  patternContext.moveTo(24, 0)
  patternContext.lineTo(24, 24)

  patternContext.stroke()

  return patternCanvas
}

export const Grid: React.FC<GridProps> = (props) => {
  const canvasSize = useRecoilValue(gridState)

  const draw = (element: HTMLCanvasElement) => {
    if (element === null) return

    if (canvasSize.width === 0 && canvasSize.height === 0) return

    const ctx = element.getContext("2d")
    ctx.clearRect(0, 0, element.width, element.height)
    ctx.beginPath()

    const currentPattern = props.pattern || defaultPattern()

    ctx.fillStyle = ctx.createPattern(currentPattern, "repeat")
    ctx.fillRect(0, 0, canvasSize.width || 0, canvasSize.height || 0)
    ctx.stroke()
  }

  return <canvas className="grid" width={canvasSize.width} height={canvasSize.height} ref={draw} />
}
