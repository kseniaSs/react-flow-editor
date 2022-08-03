import { Node, Point, Transformation } from "../../../types"
import { DISCONNECTOR_ZONE, LARGEST_RECT, MINIMUM_SVG_SIZE } from "../../constants"
import { NodeGroupsRect } from "../../types"

const WHITE_SPACE_SCREENS = 2

export const computeNodeGroupsRect = (nodes: Node[], transform: Transformation): NodeGroupsRect => {
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

  const dimensionsRect = nodes.reduce(
    (acc, node) => {
      if (node.position.x > acc.rightPoint) acc.rightPoint = node.position.x
      if (node.position.x < acc.leftPoint) acc.leftPoint = node.position.x
      if (node.position.y > acc.bottomPoint) acc.bottomPoint = node.position.y
      if (node.position.y < acc.topPoint) acc.topPoint = node.position.y

      return acc
    },
    { ...LARGEST_RECT }
  )

  const whiteSpaceX = WHITE_SPACE_SCREENS * window.innerWidth * transform.zoom
  const whiteSpaceY = WHITE_SPACE_SCREENS * window.innerHeight * transform.zoom

  dimensionsRect.leftPoint =
    dimensionsRect.leftPoint < -MINIMUM_SVG_SIZE ? dimensionsRect.leftPoint - whiteSpaceX : -MINIMUM_SVG_SIZE
  dimensionsRect.rightPoint =
    dimensionsRect.rightPoint > MINIMUM_SVG_SIZE ? dimensionsRect.rightPoint + whiteSpaceX : MINIMUM_SVG_SIZE
  dimensionsRect.topPoint =
    dimensionsRect.topPoint < -MINIMUM_SVG_SIZE ? dimensionsRect.topPoint - whiteSpaceY : -MINIMUM_SVG_SIZE
  dimensionsRect.bottomPoint =
    dimensionsRect.bottomPoint > MINIMUM_SVG_SIZE ? dimensionsRect.bottomPoint + whiteSpaceY : MINIMUM_SVG_SIZE

  return {
    ...dimensionsRect,
    realHeight: dimensionsRect.bottomPoint - dimensionsRect.topPoint,
    realWidth: dimensionsRect.rightPoint - dimensionsRect.leftPoint
  }
}

export const connectionContainerStyle = (rect: NodeGroupsRect): React.CSSProperties => ({
  minWidth: rect.realWidth,
  minHeight: rect.realHeight,
  transform: `translate(${rect.leftPoint}px, ${rect.topPoint}px)`
})

export const disconnectorStyle = (pos: Point) => ({
  transform: `translate(${pos.x - DISCONNECTOR_ZONE / 2}px, ${pos.y - DISCONNECTOR_ZONE / 2}px)`
})
