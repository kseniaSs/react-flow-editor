import { Node, Transformation } from "../../../types"
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
    {
      leftPoint: -Infinity,
      rightPoint: Infinity,
      topPoint: -Infinity,
      bottomPoint: Infinity
    }
  )

  const whiteSpaceX = WHITE_SPACE_SCREENS * window.innerWidth * transform.zoom
  const whiteSpaceY = WHITE_SPACE_SCREENS * window.innerHeight * transform.zoom

  dimensionsRect.leftPoint -= whiteSpaceX
  dimensionsRect.rightPoint += whiteSpaceX
  dimensionsRect.topPoint -= whiteSpaceY
  dimensionsRect.bottomPoint += whiteSpaceY

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
