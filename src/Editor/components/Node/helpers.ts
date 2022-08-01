import { Point, PointStyleConfig } from "../../../types"
import { DEFAULT_COLOR, DEFAULT_POINT_SIZE } from "../../constants"

export const pointStyle = (position: Point, pointConfig?: PointStyleConfig): React.CSSProperties => ({
  bottom: `${position?.y || 0}px`,
  right: `${position?.x || 0}px`,
  width: `${pointConfig?.width || DEFAULT_POINT_SIZE}px`,
  height: `${pointConfig?.height || DEFAULT_POINT_SIZE}px`,
  background: `${pointConfig?.color || DEFAULT_COLOR}`
})

export const nodeStyle = (pos: Point) => ({
  transform: `translate(${pos.x}px, ${pos.y}px)`
})

export const buildDotId = (nodeId: string) => `dot-${nodeId}`
