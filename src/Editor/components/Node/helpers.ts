import { Node, NodeState, Output, Point, PointStyleConfig } from "../../../types"
import { DEFAULT_COLOR, DEFAULT_POINT_SIZE } from "../../constants"
import { DragItemState, ItemType } from "../../types"

export const pointStyle = ({
  position,
  pointConfig,
  dragItem,
  output,
  node
}: {
  position: Point
  pointConfig?: PointStyleConfig
  dragItem: DragItemState
  output: Output
  node: Node
}): React.CSSProperties => {
  const height = pointConfig?.height || DEFAULT_POINT_SIZE
  const width = pointConfig?.width || DEFAULT_POINT_SIZE
  const isActive =
    Boolean(output.nextNodeId) || (dragItem.type === ItemType.connection && dragItem.output.id === output.id)

  const isSemiActive = [NodeState.connectorHovered, NodeState.selected].includes(node.state)

  let border = `1px solid ${pointConfig?.disconnectedColor || DEFAULT_COLOR}`

  if (isActive) {
    border = "none"
  } else if (isSemiActive) {
    border = `2px solid ${pointConfig?.color || DEFAULT_COLOR}`
  }

  return {
    top: `${position?.y || 0 - height / 2}px`,
    left: `${position?.x || 0 - width / 2}px`,
    width: `${width}px`,
    height: `${height}px`,
    background: `${(isActive ? pointConfig?.color : pointConfig?.disconnectedBg) || DEFAULT_COLOR}`,
    border
  }
}

export const nodeStyle = (pos: Point) => ({
  transform: `translate(${pos.x}px, ${pos.y}px)`
})

export const buildDotId = (nodeId: string) => `dot-${nodeId}`
