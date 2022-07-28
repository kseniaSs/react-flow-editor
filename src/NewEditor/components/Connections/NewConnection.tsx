import React from "react"
import { useRecoilValue } from "recoil"
import _ from "lodash"
import InputConnection from "./InputConnection"
import {
  dotSizeState,
  dragItemState,
  newConnectionState,
  nodesState,
  pointPositionState,
  svgOffsetState,
  zoomState
} from "../../ducks/store"
import { ItemType } from "../../types"

const BORDER_CONNECTION_LEFT_OFFSET = 120

export const NewConnection: React.FC = () => {
  const newConnectionPosition = useRecoilValue(newConnectionState)
  const nodes = useRecoilValue(nodesState)
  const pointPosition = useRecoilValue(pointPositionState)
  const dotSize = useRecoilValue(dotSizeState)
  const zoom = useRecoilValue(zoomState)
  const svgOffset = useRecoilValue(svgOffsetState)
  const dragItem = useRecoilValue(dragItemState)

  const selectedNodes = nodes.filter((node) => node.isSelected)
  const outputNode = selectedNodes.length === 1 ? _.first(selectedNodes) : null

  if (!newConnectionPosition || !outputNode || dragItem.type !== ItemType.connection) return null

  const outputPosition = outputNode.rectPosition
    ? {
        x: -svgOffset.x + outputNode.position.x + (outputNode.rectPosition?.width || 0) / zoom.zoom - pointPosition.x,
        y:
          -svgOffset.y +
          outputNode.position.y +
          (outputNode.rectPosition?.height || 0) / zoom.zoom -
          pointPosition.y -
          (dotSize?.width || 0) / 2
      }
    : outputNode.position

  const draggingConnection = {
    ...newConnectionPosition
  }

  draggingConnection.x =
    draggingConnection.x < BORDER_CONNECTION_LEFT_OFFSET ? BORDER_CONNECTION_LEFT_OFFSET : draggingConnection.x
  draggingConnection.y = draggingConnection.y < 0 ? 0 : draggingConnection.y
  draggingConnection.x = draggingConnection.x > svgOffset.width ? svgOffset.width : draggingConnection.x
  draggingConnection.y = draggingConnection.y > svgOffset.height ? svgOffset.height : draggingConnection.y

  return (
    <InputConnection key={`${outputNode.id}_new`} outputPosition={draggingConnection} inputPosition={outputPosition} />
  )
}
