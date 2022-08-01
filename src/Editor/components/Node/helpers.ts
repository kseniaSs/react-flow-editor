import { Point, PointStyleConfig } from "../../../types"
import { DEFAULT_COLOR, DEFAULT_POINT_SIZE } from "../../constants"

export const pointStyle = (position: Point, pointConfig?: PointStyleConfig): React.CSSProperties => {
  const height = pointConfig?.height || DEFAULT_POINT_SIZE
  const width = pointConfig?.width || DEFAULT_POINT_SIZE

  return {
    top: `${position?.y || 0 - height / 2}px`,
    left: `${position?.x || 0 - width / 2}px`,
    width: `${width}px`,
    height: `${height}px`,
    background: `${pointConfig?.color || DEFAULT_COLOR}`
  }
}

export const nodeStyle = (pos: Point) => ({
  transform: `translate(${pos.x}px, ${pos.y}px)`
})

export const buildDotId = (nodeId: string) => `dot-${nodeId}`
