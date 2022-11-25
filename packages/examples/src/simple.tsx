import * as React from "react"
import * as ReactDOM from "react-dom"
import {
  Editor,
  Node,
  NodeState,
  ScaleComponentProps,
  Transformation,
  OutputComponentProps
} from "@kseniass/react-flow-editor"
import "./simple.scss"
import { initialNodes, STYLED_CONFIG, TIPS } from "./constants"
import { nodeFactory } from "./helpers"
import { NodeAttributes } from "./parts"

const NodeComponent = (_: Node) => <div>Node</div>

const SelectionZoneComponent = () => <div className="selection-zone" />

const OutputComponent: React.FC<OutputComponentProps> = ({ active, nodeState }) => (
  <div
    style={{
      width: "10px",
      height: "10px",
      background: `${active ? STYLED_CONFIG.point.color : STYLED_CONFIG.point.disconnectedBg}`,
      borderRadius: "50%",
      border: active
        ? "none"
        : nodeState === NodeState.selected
        ? `2px solid ${STYLED_CONFIG.point.color}`
        : `1px solid ${STYLED_CONFIG.point.disconnectedColor}`
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

const App = () => {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes)
  const [transformation, setTransformation] = React.useState<Transformation>({ dx: 0, dy: 0, zoom: 1 })

  const createNode = (nodeName?: string) => setNodes((nodes) => nodes.concat([nodeFactory(nodeName)]))

  return (
    <div className="editor-root">
      <div className="header">Flow Editor</div>
      <div className="flow-menu">
        <div className="button" onClick={() => createNode()}>
          Create new Node
        </div>
        <NodeAttributes nodes={nodes} />
      </div>
      <div className="react-editor-container">
        <Editor
          NodeComponent={NodeComponent}
          SelectionZoneComponent={SelectionZoneComponent}
          ScaleComponent={ScaleComponent}
          OutputComponent={OutputComponent}
          nodes={nodes}
          onNodesChange={setNodes}
          transformation={transformation}
          onTransfromationChange={setTransformation}
          importantNodeIds={[initialNodes[0].id]}
          styleConfig={STYLED_CONFIG}
        />
      </div>
      <pre className="tips">{TIPS}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
