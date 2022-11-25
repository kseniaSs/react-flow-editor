import { Point } from "@/types"

export const nodeStyle = (pos: Point) => ({
  transform: `translate(${pos.x}px, ${pos.y}px)`
})

export const buildDotId = (nodeId: string) => `dot-${nodeId}`
