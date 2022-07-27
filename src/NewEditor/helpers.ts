import { useRecoilValue } from "recoil"
import { Node } from "../types"
import { nodesState } from "./ducks/store"
import { SelectionZone, Transformation } from "./types"

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

export const isNodeInSelectionZone = (node: Node, zone: SelectionZone, transform: Transformation): boolean => {
  const realLeft = Math.min(zone.cornerStart.x, zone.cornerEnd.x)
  const realRight = Math.max(zone.cornerStart.x, zone.cornerEnd.x)
  const realTop = Math.min(zone.cornerStart.y, zone.cornerEnd.y)
  const realBottom = Math.max(zone.cornerStart.y, zone.cornerEnd.y)

  const isLeftOver = realLeft < node.position.x + node.rectPosition.width / transform.zoom
  const isRightOver = realRight > node.position.x
  const isTopOver = realTop < node.position.y + node.rectPosition.height / transform.zoom
  const isBottomOver = realBottom > node.position.y

  return isLeftOver && isRightOver && isTopOver && isBottomOver
}
