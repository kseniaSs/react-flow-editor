import React, { useContext } from "react"
import { useStore } from "@nanostores/react"

import { DEFAULT_POINT_SIZE } from "@/Editor/constants"
import { EditorContext } from "@/Editor/context"
import { DragItemType } from "@/Editor/types"
import { DragItemAtom, NewConnectionAtom, NodesAtom, SvgOffsetAtom } from "@/Editor/state"

import InputConnection from "./InputConnection"

export const NewConnection: React.FC = () => {
  const { styleConfig } = useContext(EditorContext)
  const nodes = useStore(NodesAtom)
  const newConnectionPosition = useStore(NewConnectionAtom)

  const svgOffset = useStore(SvgOffsetAtom)
  const dragItem = useStore(DragItemAtom)

  const outputNode = nodes.find((node) => node.id === dragItem?.id)

  if (!outputNode || dragItem.type !== DragItemType.connection) return null

  const outputPosition = outputNode.rectPosition
    ? {
        x:
          -svgOffset.x +
          outputNode.position.x +
          (dragItem.output?.position.x || 0) +
          (styleConfig?.point?.width || DEFAULT_POINT_SIZE) / 2,
        y:
          -svgOffset.y +
          outputNode.position.y +
          (dragItem.output?.position.y || 0) +
          (styleConfig?.point?.height || DEFAULT_POINT_SIZE) / 2
      }
    : outputNode.position

  return <InputConnection key={outputNode.id} outputPosition={outputPosition} inputPosition={newConnectionPosition} />
}
