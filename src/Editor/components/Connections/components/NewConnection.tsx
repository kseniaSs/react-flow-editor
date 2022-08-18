import React, { useContext } from "react"
import { useRecoilValue } from "recoil"
import { DEFAULT_POINT_SIZE } from "../../../constants"
import { EditorContext } from "../../../context"
import { dragItemState, newConnectionState, svgOffsetState } from "../../../ducks/store"
import { ItemType } from "../../../types"
import { numberFallback } from "../helpers"
import InputConnection from "./InputConnection"

export const NewConnection: React.FC = () => {
  const { nodes, styleConfig } = useContext(EditorContext)

  const newConnectionPosition = useRecoilValue(newConnectionState)
  const svgOffset = useRecoilValue(svgOffsetState)
  const dragItem = useRecoilValue(dragItemState)

  const outputNode = nodes.find((node) => node.id === dragItem?.fromId)

  if (!newConnectionPosition || !outputNode || dragItem.type !== ItemType.connection) return null

  const currentConPosInx = dragItem.nextId
    ? outputNode.next.findIndex((conId) => conId === dragItem.nextId)
    : outputNode.next.length

  const outputPosition = outputNode.rectPosition
    ? {
        x:
          -svgOffset.x +
          outputNode.position.x +
          (outputNode.outputPosition[numberFallback(currentConPosInx, 0)]?.x || 0) +
          (styleConfig?.point?.width || DEFAULT_POINT_SIZE) / 2,
        y:
          -svgOffset.y +
          outputNode.position.y +
          (outputNode.outputPosition[numberFallback(currentConPosInx, 0)]?.y || 0) +
          (styleConfig?.point?.height || DEFAULT_POINT_SIZE) / 2
      }
    : outputNode.position

  return <InputConnection key={outputNode.id} outputPosition={newConnectionPosition} inputPosition={outputPosition} />
}
