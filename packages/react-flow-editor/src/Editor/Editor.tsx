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
  ScaleComponent,
  SelectionZoneComponent,
  importantNodeIds,
  onNodesChange,
  transformation,
  onTransfromationChange,
  styleConfig
}) => (
  <EditorContext.Provider
    value={{
      NodeComponent,
      importantNodeIds,
      styleConfig
    }}
  >
    <Canvas SelectionZoneComponent={SelectionZoneComponent} ScaleComponent={ScaleComponent} />
    <StoreUpdater
      nodes={nodes}
      onNodesChange={onNodesChange}
      transformation={transformation}
      onTransfromationChange={onTransfromationChange}
    />
  </EditorContext.Provider>
)
export default memo(Editor, isEqual)
