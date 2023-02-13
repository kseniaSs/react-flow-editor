import { isEqual } from "lodash"
import React from "react"
import { useStore } from "@nanostores/react"

import { Output as OutputType } from "@/types"
import { DragItemAtom, HoveredNodeIdAtom } from "@/Editor/state"
import { DragItemType } from "@/Editor/types"

import { BUTTON_LEFT } from "../../constants"
import { useEditorContext } from "../../editor-context"
import { resetEvent } from "../../helpers"

type Props = {
  nodeId: string
  output: OutputType
}

export const Output: React.FC<Props> = React.memo(({ nodeId, output }) => {
  const { OutputComponent } = useEditorContext()
  const hoveredNodeId = useStore(HoveredNodeIdAtom)
  const dragItem = useStore(DragItemAtom)

  const startNewConnection = (e: React.MouseEvent<HTMLElement>) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      DragItemAtom.set({
        type: DragItemType.connectionPoint,
        output: output,
        id: nodeId,
        ...output.position
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
        transform: "translate(-50%, -50%)"
      }}
    >
      <OutputComponent isOutlined={hoveredNodeId === nodeId} isActive={isActive} nodeId={nodeId} />
    </div>
  )
}, isEqual)
