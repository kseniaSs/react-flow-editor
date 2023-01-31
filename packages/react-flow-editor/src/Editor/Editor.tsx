import React from "react"

import { ConnectorsBehaviour, EditorProps } from "@/types"

import { Canvas } from "./Canvas"
import { EditorContext } from "./editor-context"
import "../_style.scss"
import { StoreUpdater } from "./StoreUpdater"

const Editor: React.FC<EditorProps> = ({
  nodes,
  NodeComponent,
  ScaleComponent,
  MenuComponent,
  OutputComponent,
  SelectionZoneComponent,
  importantNodeIds,
  onNodesChange,
  connectorStyleConfig,
  connectorsBehaviour = ConnectorsBehaviour.avoidSharpCorners
}) => (
  <EditorContext.Provider
    value={{
      NodeComponent,
      OutputComponent,
      importantNodeIds,
      connectorStyleConfig,
      connectorsBehaviour
    }}
  >
    <Canvas
      SelectionZoneComponent={SelectionZoneComponent}
      ScaleComponent={ScaleComponent}
      MenuComponent={MenuComponent}
    />

    <StoreUpdater nodes={nodes} onNodesChange={onNodesChange} />
  </EditorContext.Provider>
)

export default Editor
