import { Node, RectZone, SelectionZone, Transformation } from "../../types"

export const isNodeInSelectionZone = (node: Node, zone: SelectionZone, transform: Transformation): boolean => {
  const { left, top, right, bottom } = cornersToRect(zone)

  const isLeftOver = left < node.position.x + (node.rectPosition?.width || 0) / transform.zoom
  const isRightOver = right > node.position.x
  const isTopOver = top < node.position.y + (node.rectPosition?.height || 0) / transform.zoom
  const isBottomOver = bottom > node.position.y

  return isLeftOver && isRightOver && isTopOver && isBottomOver
}

export const cornersToRect = (zone: SelectionZone): RectZone =>
  zone
    ? {
        left: Math.min(zone.cornerStart.x, zone.cornerEnd.x),
        right: Math.max(zone.cornerStart.x, zone.cornerEnd.x),
        top: Math.min(zone.cornerStart.y, zone.cornerEnd.y),
        bottom: Math.max(zone.cornerStart.y, zone.cornerEnd.y)
      }
    : {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
