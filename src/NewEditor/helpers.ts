import { useRecoilValue } from "recoil"
import { Node } from "../types"
import { nodesState } from "./ducks/store"
import { RectZone, SelectionZone, Transformation } from "./types"

export const resetEvent = (e: React.MouseEvent<HTMLElement>) => {
  e.stopPropagation()
  e.preventDefault()
}

export const useNodeGroupsRect = () => {
  const nodes = useRecoilValue(nodesState)

  if (!nodes.length) {
    return {
      leftPoint: 0,
      rightPoint: 0,
      topPoint: 0,
      bottomPoint: 0,
      realHeight: 0,
      realWidth: 0
    }
  }

  // todo один проход
  const leftPoint = Math.min(...nodes.map((node) => node.position.x)) - window.innerWidth
  const rightPoint = Math.max(...nodes.map((node) => node.position.x)) + window.innerWidth
  const topPoint = Math.min(...nodes.map((node) => node.position.y)) - window.innerHeight
  const bottomPoint = Math.max(...nodes.map((node) => node.position.y)) + window.innerHeight
  const realHeight = bottomPoint - topPoint
  const realWidth = rightPoint - leftPoint

  return {
    leftPoint,
    rightPoint,
    topPoint,
    bottomPoint,
    realHeight,
    realWidth
  }
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

export const isNodeInSelectionZone = (node: Node, zone: SelectionZone, transform: Transformation): boolean => {
  const { left, top, right, bottom } = cornersToRect(zone)

  const isLeftOver = left < node.position.x + node.rectPosition.width / transform.zoom
  const isRightOver = right > node.position.x
  const isTopOver = top < node.position.y + node.rectPosition.height / transform.zoom
  const isBottomOver = bottom > node.position.y

  return isLeftOver && isRightOver && isTopOver && isBottomOver
}
