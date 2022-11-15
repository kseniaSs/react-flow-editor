import * as React from "react"
import * as ReactDOM from "react-dom"
import { Editor, Node, OnEditorRectsMountedProps, Transformation } from "@kseniass/react-flow-editor"
import "./simple.scss"
import { SelectionZone } from "./types"
import { initialNodes, STYLED_CONFIG, TIPS } from "./constants"
import { computeSelectionZone, nodeFactory } from "./helpers"
import { NodeAttributes } from "./parts"

const App = () => {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes)
  const [selectionZone, setSelectionZone] = React.useState<SelectionZone | null>(null)
  const [transformation, setTransformation] = React.useState<Transformation>({ dx: 0, dy: 0, zoom: 1 })
  const [editorRefs, setEditorRefs] = React.useState<OnEditorRectsMountedProps | null>(null)

  const selectionZonePosition = computeSelectionZone(editorRefs?.zoomContainerRef, transformation, selectionZone)

  return (
    <div className="editor-root">
      <div className="header">Flow Editor</div>
      <div className="selection-zone" style={selectionZonePosition} />
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
          NodeComponent={(_: Node) => <div>Node</div>}
          nodes={nodes}
          onNodesChange={setNodes}
          transformation={transformation}
          setTransformation={setTransformation}
          onSelectionZoneChanged={setSelectionZone}
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
