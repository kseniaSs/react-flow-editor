import { useRecoilValue } from "recoil"
import { Node } from "../types"
import { nodesState } from "./ducks/store"
import { AutoScrollDirection, Axis, RectZone, SelectionZone, Transformation } from "./types"
import { DRAG_OFFSET_TRANSFORM } from "../constants"

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

export const getSign = (axis: Axis, autoScroll): -1 | 0 | 1 => {
  if (axis === Axis.x && autoScroll.direction === AutoScrollDirection.left) return -1
  if (axis === Axis.x && autoScroll.direction === AutoScrollDirection.right) return 1

  if (axis === Axis.y && autoScroll.direction === AutoScrollDirection.top) return -1
  if (axis === Axis.y && autoScroll.direction === AutoScrollDirection.bottom) return 1

  return 0
}

export const setOnDrag = (offset, setAutoScroll, e, autoScroll): void => {
  const leftOverflow = offset.offsetLeft + DRAG_OFFSET_TRANSFORM - e.clientX
  const rightOverflow = e.clientX - (offset.maxRight - DRAG_OFFSET_TRANSFORM)
  const topOverflow = offset.offsetTop + DRAG_OFFSET_TRANSFORM - e.clientY
  const bottomOverflow = e.clientY - (offset.maxBottom - DRAG_OFFSET_TRANSFORM)

  if (leftOverflow > 0) {
    setAutoScroll({ speed: leftOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.left })
  }

  if (rightOverflow > 0) {
    setAutoScroll({ speed: rightOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.right })
  }

  if (topOverflow > 0) {
    setAutoScroll({ speed: topOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.top })
  }

  if (bottomOverflow > 0) {
    setAutoScroll({ speed: bottomOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.bottom })
  }

  if (autoScroll.direction && Math.max(leftOverflow, rightOverflow, topOverflow, bottomOverflow) <= 0) {
    setAutoScroll({ speed: 0, direction: null })
  }
}
