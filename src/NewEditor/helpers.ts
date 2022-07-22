import { Vector2d } from "../geometry"
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
