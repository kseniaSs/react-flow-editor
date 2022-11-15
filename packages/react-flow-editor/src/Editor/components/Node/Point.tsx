import { isEqual } from "lodash"
import React, { useContext } from "react"
import { Node, NodeState, Output } from "@/types"
import { BUTTON_LEFT } from "../../constants"
import { EditorContext, RectsContext } from "../../context"
import { resetEvent } from "../../helpers"
import { ItemType } from "../../types"
import { buildDotId, pointStyle } from "./helpers"
import { DragItemAtom, NewConnectionAtom, nodeActions, SvgOffsetAtom } from "@/Editor/state"
import { useStore } from "@nanostores/react"

type PointProps = {
  node: Node
  output: Output
}

export const Point: React.FC<PointProps> = React.memo(({ node, output }) => {
  const { styleConfig, transformation } = useContext(EditorContext)
  const { zoomContainerRef } = useContext(RectsContext)
  const svgOffset = useStore(SvgOffsetAtom)

  const dragItem = useStore(DragItemAtom)
  const zoomRect = zoomContainerRef?.current.getBoundingClientRect()

  const setNode = (e: React.MouseEvent<HTMLElement>) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      nodeActions.changeNodeState(node.id, NodeState.draggingConnector)

      const pos = {
        x: -svgOffset.x + (e.clientX - zoomRect.left) / transformation.zoom,
        y: -svgOffset.y + (e.clientY - zoomRect.top) / transformation.zoom
      }

      NewConnectionAtom.set(pos)

      DragItemAtom.set({
        type: ItemType.connection,
        output,
        id: node.id,
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  return (
    <div
      id={buildDotId(node.id)}
      className="dot"
      style={pointStyle({
        position: output.position,
        pointConfig: styleConfig?.point,
        node,
        dragItem,
        output
      })}
      onMouseDown={setNode}
    />
  )
}, isEqual)
