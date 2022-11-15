import React, { useRef } from "react"
import { useStore } from "@nanostores/react"

import Background from "./components/Background/Background"
import { TransformCanvasStyle, useEditorMount } from "./helpers"
import useDnD from "./helpers/DnD"
import { useZoom } from "./helpers/zoom"
import { useHotKeys } from "./helpers/hotKeys"
import { NodesContainer } from "./components/Node"
import { RectsContext } from "./context"
import { DragItemAtom, TransformationAtom } from "./state"
import { SelectionZone } from "./components/SelectionZone"

type Props = {
  SelectionZoneComponent?: React.FC
}

export const Canvas: React.FC<Props> = ({ SelectionZoneComponent }) => {
  const zoomContainerRef = useRef<HTMLDivElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)

  const dragItem = useStore(DragItemAtom)
  const transformation = useStore(TransformationAtom)

  const { onDrag, onDragEnded, onDragStarted } = useDnD({ editorContainerRef, zoomContainerRef })
  const { onWheel } = useZoom({ zoomContainerRef, editorContainerRef })
  useEditorMount({ zoomContainerRef, editorContainerRef })

  useHotKeys()

  return (
    <RectsContext.Provider value={{ zoomContainerRef, editorContainerRef }}>
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
        {SelectionZoneComponent && (
          <SelectionZone zoomContainerRef={zoomContainerRef}>
            <SelectionZoneComponent />
          </SelectionZone>
        )}
      </div>
    </RectsContext.Provider>
  )
}
