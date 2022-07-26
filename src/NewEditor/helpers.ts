import { useRecoilValue } from "recoil"
import { Vector2d } from "../geometry"
import { nodesState } from "./ducks/store"
import { Point } from "./types"

export const resetEvent = (e: React.MouseEvent<HTMLElement>) => {
  e.stopPropagation()
  e.preventDefault()
}

export const inNode = (inputPosition: Vector2d, nodePosition: DOMRect, position: Point): boolean =>
  position.x < inputPosition.x &&
  inputPosition.x < position.x + nodePosition.width &&
  position.y < inputPosition.y &&
  inputPosition.y < position.y + nodePosition.height

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
