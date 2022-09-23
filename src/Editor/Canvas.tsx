import React, { useContext } from "react"
import { useRecoilValue } from "recoil"

import { dragItemState } from "./ducks/store"
import Background from "./components/Background"
import { TransformCanvasStyle, useEditorMount } from "./helpers"
import { useDnD } from "./helpers/DnD"
import { useZoom } from "./helpers/zoom"
import { useHotKeys } from "./helpers/hotKeys"
import { NodesContainer } from "./components/Node"
import { EditorContext, RectsContext } from "./context"

export const Canvas: React.FC = () => {
  const { transformation } = useContext(EditorContext)
  const currentDragItem = useRecoilValue(dragItemState)
  const rects = useEditorMount()
  const { zoomContainerRef, editorContainerRef } = rects
  const { onDrag, onDragEnded, onDragStarted } = useDnD(editorContainerRef, zoomContainerRef)
  const { onWheel } = useZoom(zoomContainerRef, editorContainerRef)

  useHotKeys()

  console.log("CANVAS")

  return (
    <RectsContext.Provider value={rects}>
      <div
        onMouseUp={onDragEnded}
        onMouseMove={currentDragItem.type && onDrag}
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
