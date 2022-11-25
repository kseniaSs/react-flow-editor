import { isEqual } from "lodash"
import React, { useContext } from "react"
import { useStore } from "@nanostores/react"

import { Node, NodeState, Output as OutputType } from "@/types"
import { DragItemAtom, NewConnectionAtom, nodeActions, SvgOffsetAtom, TransformationMap } from "@/Editor/state"
import { getRectFromRef } from "@/Editor/helpers/getRectFromRef"

import { BUTTON_LEFT } from "../../constants"
import { EditorContext, RectsContext } from "../../context"
import { resetEvent } from "../../helpers"
import { DragItemType } from "../../types"

type Props = {
  node: Node
  output: OutputType
}

export const Output: React.FC<Props> = React.memo(({ node, output }) => {
  const { OutputComponent } = useContext(EditorContext)
  const { zoomContainerRef } = useContext(RectsContext)
  const svgOffset = useStore(SvgOffsetAtom)
  const transformation = useStore(TransformationMap)
  const dragItem = useStore(DragItemAtom)

  const startNewConnection = (e: React.MouseEvent<HTMLElement>) => {
    const zoomRect = getRectFromRef(zoomContainerRef)

    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      nodeActions.changeNodeState(node.id, NodeState.draggingConnector)

      const pos = {
        x: -svgOffset.x + (e.clientX - zoomRect.left) / transformation.zoom,
        y: -svgOffset.y + (e.clientY - zoomRect.top) / transformation.zoom
      }

      NewConnectionAtom.set(pos)

      DragItemAtom.set({
        type: DragItemType.connection,
        output,
        id: node.id,
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  const isActive = Boolean(output.nextNodeId) || dragItem.output?.id === output.id

  if (!OutputComponent) return null

  return (
    <div
      className="dot"
      onMouseDown={startNewConnection}
      style={{
        top: `${output.position.y}px`,
        left: `${output.position.x}px`,
        transform: "translate(50%)"
      }}
    >
      <OutputComponent active={isActive} nodeState={node.state} />
    </div>
  )
}, isEqual)
