import React, { useEffect, useContext } from "react"
import { dragItemState } from "./ducks/store"
import { Container as ConnectionContainer } from "./components/Connections"
import Background from "./components/Background"
import { CLASSES } from "./constants"
import { EditorContext } from "./Editor"
import { TransformCanvasStyle, useEditorMount, useRecalculateRects } from "./helpers"
import { useDnD } from "./helpers/DnD"
import { useZoom } from "./helpers/zoom"
import { useRecoilValue } from "recoil"
import Node from "./components/Node"
import { isEqual } from "lodash"
import { useHotKeys } from "./helpers/hotKeys"

export const Canvas: React.FC = React.memo(() => {
  const { nodes, transformation } = useContext(EditorContext)

  const currentDragItem = useRecoilValue(dragItemState)
  const { zoomContainerRef, editorContainerRef } = useEditorMount()
  const recalculateRects = useRecalculateRects()
  const { onDrag, onDragEnded, onDragStarted } = useDnD(editorContainerRef, zoomContainerRef)
  const { onWheel } = useZoom(zoomContainerRef, editorContainerRef)

  useHotKeys()

  useEffect(() => {
    if (!nodes.length) return

    recalculateRects()
  }, [transformation.zoom])

  return (
    <div
      onMouseUp={onDragEnded}
      onMouseMove={currentDragItem.type && onDrag}
      onWheel={onWheel}
      onMouseDown={onDragStarted}
      ref={editorContainerRef}
      className={CLASSES.EDITOR}
    >
      <div ref={zoomContainerRef} className={CLASSES.ZOOM_CONTAINER} style={TransformCanvasStyle(transformation)}>
        {nodes.map((node) => (
          <Node node={node} key={node.id} />
        ))}
        <ConnectionContainer />
      </div>
      <Background />
    </div>
  )
}, isEqual)
