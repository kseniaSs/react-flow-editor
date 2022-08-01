import { first } from "lodash"
import React, { useContext, useMemo } from "react"
import { useRecoilValue } from "recoil"
import { DEFAULT_POINT_SIZE } from "../../../constants"
import { dragItemState, newConnectionState, svgOffsetState } from "../../../ducks/store"
import { EditorContext } from "../../../Editor"
import { ItemType } from "../../../types"
import InputConnection from "./InputConnection"

const BORDER_CONNECTION_LEFT_OFFSET = 120

export const NewConnection: React.FC = () => {
  const { nodes, styleConfig } = useContext(EditorContext)

  const newConnectionPosition = useRecoilValue(newConnectionState)
  const svgOffset = useRecoilValue(svgOffsetState)
  const dragItem = useRecoilValue(dragItemState)

  const selectedNodes = useMemo(() => nodes.filter((node) => node.isSelected), [nodes])
  const outputNode = selectedNodes.length === 1 ? first(selectedNodes) : null

  if (!newConnectionPosition || !outputNode || dragItem.type !== ItemType.connection) return null

  const outputPosition = outputNode.rectPosition
    ? {
        x: -svgOffset.x + outputNode.position.x + (outputNode?.outputPosition?.x || 0),
        y:
          -svgOffset.y +
          outputNode.position.y +
          (outputNode?.outputPosition?.y || 0) -
          (styleConfig?.point?.width || DEFAULT_POINT_SIZE) / 2
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

  return <InputConnection key={outputNode.id} outputPosition={draggingConnection} inputPosition={outputPosition} />
}
