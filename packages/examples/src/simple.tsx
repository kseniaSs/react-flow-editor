import * as React from "react"
import * as ReactDOM from "react-dom"
import { Editor, Node, OnEditorRectsMountedProps } from "@kseniass/react-flow-editor"
import "./simple.scss"
import { initialNodes, STYLED_CONFIG, TIPS } from "./constants"
import { nodeFactory } from "./helpers"
import { NodeAttributes } from "./parts"

const NodeComponent = (_: Node) => <div>Node</div>

const SelectionZoneComponent = () => <div className="selection-zone" />

const App = () => {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes)
  const [editorRefs, setEditorRefs] = React.useState<OnEditorRectsMountedProps | null>(null)

  return (
    <div className="editor-root">
      <div className="header">Flow Editor</div>
      <div className="flow-menu">
        <div className="button" onClick={() => setNodes(nodes.concat([nodeFactory()]))}>
          Create new Node
        </div>
        <div className="button" onClick={() => editorRefs?.overview()}>
          Overview
        </div>
        <NodeAttributes nodes={nodes} />
      </div>
      <div className="react-editor-container">
        <Editor
          NodeComponent={NodeComponent}
          SelectionZoneComponent={SelectionZoneComponent}
          nodes={nodes}
          onNodesChange={setNodes}
          onEditorRectsMounted={setEditorRefs}
          importantNodeIds={[initialNodes[0].id]}
          styleConfig={STYLED_CONFIG}
        />
      </div>
      <pre className="tips">{TIPS}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
