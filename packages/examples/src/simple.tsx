import * as React from "react"
import * as ReactDOM from "react-dom"
import { useStore } from "@nanostores/react"
import {
  Editor,
  Node,
  NodeState,
  ScaleComponentProps,
  OutputComponentProps,
  MenuComponentProps
} from "@kseniass/react-flow-editor"
import "./simple.scss"

import { initialNodes, STYLED_CONFIG, TIPS, OUTPUT_STYLES } from "./constants"
import { createNode } from "./helpers"
import { NodeAttributes } from "./parts"
import { NodesAtom } from "./store"

const NodeComponent = (node: Node) => (
  <div className={`nodeElement${node.state === NodeState.disabled ? " disabled" : ""}`}>Node</div>
)

const SelectionZoneComponent = () => <div className="selection-zone" />

const OutputComponent: React.FC<OutputComponentProps> = ({ active, nodeState }) => (
  <div
    style={{
      width: "10px",
      height: "10px",
      background: `${active ? OUTPUT_STYLES.color : OUTPUT_STYLES.disconnectedBg}`,
      borderRadius: "50%",
      border: active
        ? "none"
        : nodeState === NodeState.selected
        ? `2px solid ${OUTPUT_STYLES.color}`
        : `1px solid ${OUTPUT_STYLES.disconnectedColor}`
    }}
  />
)

const ScaleComponent: React.FC<ScaleComponentProps> = ({ zoomIn, zoomOut, overview }) => (
  <div className="scale">
    <div className="scale-btn" onClick={zoomIn}>
      Zoom in
    </div>
    <div className="scale-btn" onClick={zoomOut}>
      Zoom out
    </div>
    <div className="scale-btn" onClick={overview}>
      Overview
    </div>
  </div>
)

const MenuComponent: React.FC<MenuComponentProps> = () => (
  <div className="flow-menu button" onClick={createNode}>
    Create new Node
  </div>
)

const App = () => {
  const nodes = useStore(NodesAtom)

  return (
    <div className="editor-root">
      <div className="header">Flow Editor</div>
      <div className="flow-info">
        <NodeAttributes nodes={nodes} />
      </div>
      <div className="react-editor-container">
        <Editor
          NodeComponent={NodeComponent}
          SelectionZoneComponent={SelectionZoneComponent}
          ScaleComponent={ScaleComponent}
          OutputComponent={OutputComponent}
          MenuComponent={MenuComponent}
          nodes={nodes}
          onNodesChange={NodesAtom.set}
          importantNodeIds={[initialNodes[0].id]}
          connectorStyleConfig={STYLED_CONFIG}
        />
      </div>
      <pre className="tips">{TIPS}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
