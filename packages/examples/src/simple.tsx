import * as React from "react"
import * as ReactDOM from "react-dom"
import { Editor, Node, ScaleComponentProps } from "@kseniass/react-flow-editor"
import "./simple.scss"
import { initialNodes, STYLED_CONFIG, TIPS } from "./constants"
import { nodeFactory } from "./helpers"
import { NodeAttributes } from "./parts"

const NodeComponent = (_: Node) => <div>Node</div>

const SelectionZoneComponent = () => <div className="selection-zone" />

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
          nodes={nodes}
          onNodesChange={setNodes}
          importantNodeIds={[initialNodes[0].id]}
          styleConfig={STYLED_CONFIG}
        />
      </div>
      <pre className="tips">{TIPS}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
