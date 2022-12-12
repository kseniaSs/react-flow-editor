import React, { useRef } from "react"
import { useStore } from "@nanostores/react"

import { ScaleComponentProps } from "@/types"

import Background from "./components/Background/Background"
import { transformCanvasStyle, useEditorRectsMounted } from "./helpers"
import useDnD from "./helpers/DnD"
import { useZoom } from "./helpers/zoom"
import { useHotKeys } from "./helpers/hotKeys"
import { NodesContainer } from "./components/Node"
import { RectsContext } from "./rects-context"
import { TransformationMap } from "./state"
import { SelectionZone } from "./components/SelectionZone"
import { Scale } from "./components/Scale"

type Props = {
  SelectionZoneComponent?: React.FC
  ScaleComponent?: React.FC<ScaleComponentProps>
}

export const Canvas: React.FC<Props> = ({ SelectionZoneComponent, ScaleComponent }) => {
  const zoomContainerRef = useRef<HTMLDivElement>(document.querySelector(".zoom-container")!)
  const editorContainerRef = useRef<HTMLDivElement>(document.querySelector(".react-flow-editor")!)

  const transformation = useStore(TransformationMap)

  const { onDrag, onDragEnded, onDragStarted } = useDnD({ editorContainerRef, zoomContainerRef })
  const { onWheel } = useZoom({ zoomContainerRef, editorContainerRef })
  useEditorRectsMounted({ zoomContainerRef, editorContainerRef })

  useHotKeys()

  return (
    <RectsContext.Provider
      value={{ zoomContainer: zoomContainerRef.current, editorContainer: editorContainerRef.current }}
    >
      <div
        onMouseUpCapture={onDragEnded}
        onMouseMove={onDrag}
        onWheel={onWheel}
        onMouseDownCapture={onDragStarted}
        ref={editorContainerRef}
        className="react-flow-editor"
      >
        <div ref={zoomContainerRef} className="zoom-container" style={transformCanvasStyle(transformation)}>
          <NodesContainer />
        </div>
        <Background />
        {SelectionZoneComponent && (
          <SelectionZone zoomContainerRef={zoomContainerRef}>
            <SelectionZoneComponent />
          </SelectionZone>
        )}

        {ScaleComponent && <Scale ScaleComponent={ScaleComponent} />}
      </div>
    </RectsContext.Provider>
  )
}
