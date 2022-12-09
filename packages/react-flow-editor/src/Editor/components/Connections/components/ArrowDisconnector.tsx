import React, { useCallback } from "react"
import { useStore } from "@nanostores/react"

import { NodeState, Output, Point } from "@/types"
import { DragItemType } from "@/Editor/types"
import {
  DragItemAtom,
  NewConnectionAtom,
  nodeActions,
  NodesAtom,
  SvgOffsetAtom,
  TransformationMap
} from "@/Editor/state"
import { useRectsContext } from "@/Editor/rects-context"

import { disconnectorStyle } from "../helpers"
import { markDisabledNodes } from "../../Node/helpers"

type DisconnectorProps = {
  position: Point
  fromId: string
  output: Output
}

const ArrowDisconnector: React.FC<DisconnectorProps> = ({ position, fromId, output }) => {
  const { zoomContainer } = useRectsContext()
  const transformation = useStore(TransformationMap)
  const svgOffset = useStore(SvgOffsetAtom)
  const nodes = useStore(NodesAtom)

  const onMouseDown = useCallback(
    (e) => {
      e.stopPropagation()

      const fromNode = nodes.find((node) => node.id === fromId)!
      markDisabledNodes(fromNode, nodes)

      DragItemAtom.set({
        type: DragItemType.connection,
        id: fromId,
        output,
        x: e.clientX,
        y: e.clientY
      })

      const zoomRect = zoomContainer.getBoundingClientRect()

      const newPos = {
        x: (e.clientX - zoomRect.left) / transformation.zoom - svgOffset.x,
        y: (e.clientY - zoomRect.top) / transformation.zoom - svgOffset.y
      }

      NewConnectionAtom.set(newPos)

      nodeActions.changeNodeState(fromId, NodeState.draggingConnector)
    },
    [transformation, zoomContainer, svgOffset]
  )

  return <rect onMouseDown={onMouseDown} className="disconnector" style={disconnectorStyle(position)} />
}

export default ArrowDisconnector
