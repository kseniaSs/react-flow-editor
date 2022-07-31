import { first } from "lodash"
import React, { useContext, useMemo } from "react"
import { useRecoilValue } from "recoil"
import { dotSizeState, dragItemState, newConnectionState, svgOffsetState } from "../../../ducks/store"
import { EditorContext } from "../../../Editor"
import { ItemType } from "../../../types"
import InputConnection from "./InputConnection"

const BORDER_CONNECTION_LEFT_OFFSET = 120

export const NewConnection: React.FC = () => {
  const { nodes, transformation } = useContext(EditorContext)

  const newConnectionPosition = useRecoilValue(newConnectionState)
  const dotSize = useRecoilValue(dotSizeState)
  const svgOffset = useRecoilValue(svgOffsetState)
  const dragItem = useRecoilValue(dragItemState)

  const selectedNodes = useMemo(() => nodes.filter((node) => node.isSelected), [nodes])
  const outputNode = selectedNodes.length === 1 ? first(selectedNodes) : null

  if (!newConnectionPosition || !outputNode || dragItem.type !== ItemType.connection) return null

  const outputPosition = useMemo(
    () =>
      outputNode.rectPosition
        ? {
            x:
              -svgOffset.x +
              outputNode.position.x +
              (outputNode.rectPosition?.width || 0) / transformation.zoom -
              outputNode.outputPosition.x,
            y:
              -svgOffset.y +
              outputNode.position.y +
              (outputNode.rectPosition?.height || 0) / transformation.zoom -
              outputNode.outputPosition.y -
              (dotSize?.width || 0) / 2
          }
        : outputNode.position,
    [outputNode, svgOffset, transformation, dotSize]
  )

  const draggingConnection = useMemo(() => {
    const temp = {
      ...newConnectionPosition
    }

    temp.x = temp.x < BORDER_CONNECTION_LEFT_OFFSET ? BORDER_CONNECTION_LEFT_OFFSET : temp.x
    temp.y = temp.y < 0 ? 0 : temp.y
    temp.x = temp.x > svgOffset.width ? svgOffset.width : temp.x
    temp.y = temp.y > svgOffset.height ? svgOffset.height : temp.y

    return temp
  }, [svgOffset])

  return <InputConnection key={outputNode.id} outputPosition={draggingConnection} inputPosition={outputPosition} />
}
