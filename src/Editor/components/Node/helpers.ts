import { Point } from "../../../types"

export const pointStyle = (position: Point): React.CSSProperties => ({
  bottom: `${position.y}px`,
  right: `${position.x}px`
})

export const nodeStyle = (pos: Point) => ({
  transform: `translate(${pos.x}px, ${pos.y}px)`
})

export const buildDotId = (nodeId: string) => `dot-${nodeId}`
