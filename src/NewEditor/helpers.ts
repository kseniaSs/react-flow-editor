import { Vector2d } from "../geometry"

export const resetEvent = (e: React.MouseEvent<HTMLElement>) => {
  e.stopPropagation()
  e.preventDefault()
}

export const inNode = (inputPosition: Vector2d, nodePosition: DOMRect): boolean => {
  console.log(inputPosition, "input Position", nodePosition)
  return false
}
