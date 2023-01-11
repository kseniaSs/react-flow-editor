import { isEqual } from "lodash"
import React from "react"
import { useStore } from "@nanostores/react"

import { NodeState, Output as OutputType } from "@/types"
import { DragItemAtom, HoveredNodeIdAtom, newConnectionActions } from "@/Editor/state"
import { useRectsContext } from "@/Editor/rects-context"

import { BUTTON_LEFT } from "../../constants"
import { useEditorContext } from "../../editor-context"
import { findDOMRect, resetEvent } from "../../helpers"

type Props = {
  nodeId: string
  nodeState: NodeState | null
  output: OutputType
}

export const Output: React.FC<Props> = React.memo(({ nodeId, nodeState, output }) => {
  const { OutputComponent } = useEditorContext()
  const { zoomContainerRef } = useRectsContext()
  const hoveredNodeId = useStore(HoveredNodeIdAtom)
  const dragItem = useStore(DragItemAtom)

  const startNewConnection = (e: React.MouseEvent<HTMLElement>) => {
    const zoomRect = findDOMRect(zoomContainerRef.current)

    resetEvent(e)
    if (e.button === BUTTON_LEFT && zoomRect) {
      newConnectionActions.startNewConnection(nodeId, zoomRect, e, output)
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
        transform: "translate(-50%, -50%)"
      }}
    >
      <OutputComponent isOutlined={hoveredNodeId === nodeId} isActive={isActive} nodeState={nodeState} />
    </div>
  )
}, isEqual)
