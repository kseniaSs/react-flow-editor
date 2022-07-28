import * as React from "react"
import * as ReactDOM from "react-dom"
import { Editor, Node, EditorPublicApi } from "@kseniass/react-flow-editor"
import _ from "lodash"
import "./simple.scss"
import { PublicApiState, SelectionZone } from "./types"
import { initialNodes, inputPosition, pointPosition, TIPS } from "./constants"
import { computeSelectionZone, isNeedUpdate, nodeFactory } from "./helpers"
import { NodeAttributes } from "./parts"

const App = () => {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes)
  const [selectionZone, setSelectionZone] = React.useState<SelectionZone | null>(null)
  const editorApi = React.useRef<null | PublicApiState>(null)

  React.useEffect(() => {
    EditorPublicApi.subscribe((val) => {
      if (isNeedUpdate(nodes, val.stateNodes)) {
        setNodes(val.stateNodes)
      }

      editorApi.current = val
    })
  }, [nodes])

  const onSelectionZoneChanged = React.useCallback((val) => setSelectionZone(val), [])
  const selectionZonePosition = React.useMemo(
    () => computeSelectionZone(editorApi.current, selectionZone),
    [selectionZone]
  )

  return (
    <div className="editor-root">
      <div className="header">Flow Editor</div>
      <div className="selection-zone" style={selectionZonePosition} />
      <div className="flow-menu">
        <div className="button" onClick={() => setNodes((nodes) => [...nodes, nodeFactory(editorApi.current)])}>
          Create new Node
        </div>
        <NodeAttributes nodes={nodes} />
      </div>
      <div className="react-editor-container">
        <Editor
          nodes={nodes}
          pointPosition={pointPosition}
          isSingleOutputConnection
          inputPosition={inputPosition}
          onSelectionZoneChanged={onSelectionZoneChanged}
        />
      </div>
      <pre className="tips">{TIPS}</pre>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
