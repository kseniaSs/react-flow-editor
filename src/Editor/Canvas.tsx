import React, { useEffect, useContext } from "react"
import { dragItemState } from "./ducks/store"
import { Container as ConnectionContainer } from "./components/Connections/Container"
import Background from "./components/Background"
import { NodeContainer } from "./components/Nodes/NodesContainer"
import { CLASSES, KEY_CODE_BACK, KEY_CODE_DELETE } from "./constants"
import { EditorContext } from "./Editor"
import { TransformCanvasStyle, useEditorMount, useRecalculateRects } from "./helpers"
import { useDnD } from "./helpers/DnD"
import { useZoom } from "./helpers/zoom"
import { useRecoilValue } from "recoil"

export const Canvas: React.FC = () => {
  const { nodes, transformation, setNodes } = useContext(EditorContext)

  const currentDragItem = useRecoilValue(dragItemState)
  const { zoomContainerRef, editorContainerRef } = useEditorMount()
  const recalculateRects = useRecalculateRects()
  const { onDrag, onDragEnded, onDragStarted } = useDnD(editorContainerRef, zoomContainerRef)
  const { onWheel } = useZoom()

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if ([KEY_CODE_BACK, KEY_CODE_DELETE].includes(e.key)) {
      setNodes((nodes) => nodes.filter((node) => !node.isSelected))
    }
  }

  useEffect(() => {
    if (!nodes.length) return

    recalculateRects()
  }, [transformation.zoom])

  return (
    <div
      onMouseUp={onDragEnded}
      onMouseMove={currentDragItem.type && onDrag}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      onMouseDown={onDragStarted}
      ref={editorContainerRef}
      className={CLASSES.EDITOR}
    >
      <div ref={zoomContainerRef} className={CLASSES.ZOOM_CONTAINER} style={TransformCanvasStyle(transformation)}>
        <NodeContainer />
        <ConnectionContainer />
      </div>
      <Background />
    </div>
  )
}
