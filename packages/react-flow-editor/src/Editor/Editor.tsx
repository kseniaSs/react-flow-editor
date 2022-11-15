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
  SelectionZoneComponent,
  onEditorRectsMounted,
  importantNodeIds,
  onNodesChange,
  styleConfig
}) => (
  <EditorContext.Provider
    value={{
      NodeComponent,
      onNodesChange,
      onEditorRectsMounted,
      importantNodeIds,
      styleConfig
    }}
  >
    <Canvas SelectionZoneComponent={SelectionZoneComponent} />
    <StoreUpdater nodes={nodes} onNodesChange={onNodesChange} />
  </EditorContext.Provider>
)
export default memo(Editor, isEqual)
