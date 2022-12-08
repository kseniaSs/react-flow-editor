import React, { useCallback, useContext } from "react"
import { useStore } from "@nanostores/react"

import { NodeState, Output, Point } from "@/types"
import { DragItemType } from "@/Editor/types"
import { RectsContext } from "@/Editor/context"
import {
  DragItemAtom,
  NewConnectionAtom,
  nodeActions,
  NodesAtom,
  SvgOffsetAtom,
  TransformationMap
} from "@/Editor/state"
import { getRectFromRef } from "@/Editor/helpers/getRectFromRef"

import { disconnectorStyle } from "../helpers"
import { markDisabledNodes } from "../../Node/helpers"

type DisconnectorProps = {
  position: Point
  fromId: string
  output: Output
}

const ArrowDisconnector: React.FC<DisconnectorProps> = ({ position, fromId, output }) => {
  const { zoomContainerRef } = useContext(RectsContext)
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

      const zoomRect = getRectFromRef(zoomContainerRef)

      const newPos = {
        x: (e.clientX - zoomRect.left) / transformation.zoom - svgOffset.x,
        y: (e.clientY - zoomRect.top) / transformation.zoom - svgOffset.y
      }

      NewConnectionAtom.set(newPos)

      nodeActions.changeNodeState(fromId, NodeState.draggingConnector)
    },
    [transformation, zoomContainerRef, svgOffset]
  )

  return <rect onMouseDown={onMouseDown} className="disconnector" style={disconnectorStyle(position)} />
}

export default ArrowDisconnector
