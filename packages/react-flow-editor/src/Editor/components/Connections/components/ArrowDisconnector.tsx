import React, { useCallback, useContext } from "react"
import { useStore } from "@nanostores/react"

import { NodeState, Output, Point } from "@/types"
import { DragItemType } from "@/Editor/types"
import { EditorContext, RectsContext } from "@/Editor/context"
import { DragItemAtom, NewConnectionAtom, nodeActions, SvgOffsetAtom } from "@/Editor/state"
import { getRectFromRef } from "@/Editor/helpers/getRectFromRef"

import { disconnectorStyle } from "../helpers"

type DisconnectorProps = {
  position: Point
  fromId: string
  output: Output
}

const ArrowDisconnector: React.FC<DisconnectorProps> = ({ position, fromId, output }) => {
  const { zoomContainerRef } = useContext(RectsContext)
  const { transformation } = useContext(EditorContext)
  const svgOffset = useStore(SvgOffsetAtom)

  const onMouseDown = useCallback(
    (e) => {
      e.stopPropagation()

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
