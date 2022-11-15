import React, { memo } from "react"
import { isEqual } from "lodash"
import type { EditorProps } from "@/types"
import { Canvas } from "./Canvas"

import { EditorContext } from "./context"

import "../_style.scss"
import { StoreUpdater } from "./StoreUpdater"

const Editor: React.FC<EditorProps> = ({
  nodes,
  NodeComponent,
  transformation,
  setTransformation,
  onSelectionZoneChanged,
  onEditorRectsMounted,
  importantNodeIds,
  onNodesChange,
  styleConfig
}) => (
  <EditorContext.Provider
    value={{
      nodes,
      NodeComponent,
      transformation,
      onNodesChange,
      setTransformation,
      onSelectionZoneChanged,
      onEditorRectsMounted,
      importantNodeIds,
      styleConfig
    }}
  >
    <Canvas />
    <StoreUpdater nodes={nodes} onNodesChange={onNodesChange} />
  </EditorContext.Provider>
)
export default memo(Editor, isEqual)
