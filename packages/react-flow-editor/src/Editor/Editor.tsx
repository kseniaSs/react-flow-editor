import React, { memo } from "react"
import { RecoilRoot } from "recoil"
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
    <RecoilRoot>
      <Canvas />
      <StoreUpdater nodes={nodes} onNodesChange={onNodesChange} />
    </RecoilRoot>
  </EditorContext.Provider>
)
export default memo(Editor, isEqual)
