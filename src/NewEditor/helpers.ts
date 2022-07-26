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

  const leftPoint = Math.min(...nodes.map((node) => node.position.x)) - window.innerWidth
  const rightPoint = Math.max(...nodes.map((node) => node.position.x)) + window.innerWidth
  const topPoint = Math.min(...nodes.map((node) => node.position.y)) - window.innerHeight
  const bottomPoint = Math.max(...nodes.map((node) => node.position.y)) + window.innerHeight
  const realHeight = bottomPoint - topPoint
  const realWidth = rightPoint - leftPoint

  console.log("useNodeGroupsRect", topPoint)

  return {
    leftPoint,
    rightPoint,
    topPoint,
    bottomPoint,
    realHeight,
    realWidth
  }
}
