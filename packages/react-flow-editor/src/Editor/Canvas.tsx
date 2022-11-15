import React, { useContext } from "react"
import { useStore } from "@nanostores/react"

import Background from "./components/Background/Background"
import { TransformCanvasStyle, useEditorMount } from "./helpers"
import useDnD from "./helpers/DnD"
import { useZoom } from "./helpers/zoom"
import { useHotKeys } from "./helpers/hotKeys"
import { NodesContainer } from "./components/Node"
import { EditorContext, RectsContext } from "./context"
import { DragItemAtom } from "./state"

export const Canvas: React.FC = () => {
  const { transformation } = useContext(EditorContext)
  const dragItem = useStore(DragItemAtom)
  const rects = useEditorMount()
  const { zoomContainerRef, editorContainerRef } = rects
  const { onDrag, onDragEnded, onDragStarted } = useDnD(editorContainerRef, zoomContainerRef)
  const { onWheel } = useZoom(zoomContainerRef, editorContainerRef)

  useHotKeys()

  return (
    <RectsContext.Provider value={rects}>
      {}
      <div
        onMouseUp={onDragEnded}
        onMouseMove={dragItem.type && onDrag}
        onWheel={onWheel}
        onMouseDown={onDragStarted}
        ref={editorContainerRef}
        className="react-flow-editor"
      >
        <div ref={zoomContainerRef} className="zoom-container" style={TransformCanvasStyle(transformation)}>
          <NodesContainer />
        </div>
        <Background />
      </div>
    </RectsContext.Provider>
  )
}
