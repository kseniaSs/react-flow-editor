import * as React from "react"
import * as ReactDOM from "react-dom"
import { Editor, Node, OnEditorRectsMountedProps, Transformation } from "@kseniass/react-flow-editor"
import "./simple.scss"
import { SelectionZone } from "./types"
import { initialNodes, TIPS } from "./constants"
import { computeSelectionZone, nodeFactory } from "./helpers"
import { NodeAttributes } from "./parts"

const App = () => {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes)
  const [selectionZone, setSelectionZone] = React.useState<SelectionZone | null>(null)
  const [transformation, setTransformation] = React.useState<Transformation>({ dx: 0, dy: 0, zoom: 1 })
  const [editorRefs, setEditorRefs] = React.useState<OnEditorRectsMountedProps | null>(null)

  const onSelectionZoneChanged = React.useCallback((val) => setSelectionZone(val), [])

  const selectionZonePosition = React.useMemo(
    () => computeSelectionZone(editorRefs?.zoomContainerRef, transformation, selectionZone),
    [selectionZone, editorRefs]
  )

  const onEditorRectsMounted = React.useCallback((val) => setEditorRefs(val), [])

  return (
    <div className="editor-root">
      <div className="header">Flow Editor</div>
      <div className="selection-zone" style={selectionZonePosition} />
      <div className="flow-menu">
        <div className="button" onClick={() => setNodes((nodes) => [...nodes, nodeFactory()])}>
          Create new Node
        </div>
        <NodeAttributes nodes={nodes} />
      </div>
      <div className="react-editor-container">
        <Editor
          nodes={nodes}
          setNodes={setNodes}
          transformation={transformation}
          setTransformation={setTransformation}
          isSingleOutputConnection
          onSelectionZoneChanged={onSelectionZoneChanged}
          onEditorRectsMounted={onEditorRectsMounted}
        />
      </div>
      <pre className="tips">{TIPS}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
