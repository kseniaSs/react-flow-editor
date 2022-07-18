import { Vector2d } from "../geometry"

export const resetEvent = (e: React.MouseEvent<HTMLElement>) => {
  e.stopPropagation()
  e.preventDefault()
}

export const inNode = (inputPosition: Vector2d, nodePosition: DOMRect): boolean =>
  nodePosition.left < inputPosition.x &&
  inputPosition.x < nodePosition.right &&
  nodePosition.top < inputPosition.y &&
  inputPosition.y < nodePosition.bottom
