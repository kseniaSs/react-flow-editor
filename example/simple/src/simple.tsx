import * as React from "react"
import * as ReactDOM from "react-dom"

import { Editor, Node, EditorPublicApi } from "@kseniass/react-flow-editor"
import "./simple.scss"

const node1Factory = (): Node => ({
  id: "Node_1",
  children: <div>Simple children</div>,
  position: {
    x: 110,
    y: 110
  },
  input: ["Node_2"]
})

const node2Factory = (): Node => ({
  id: "Node_2",
  children: <div>Node 2</div>,
  position: {
    x: 310,
    y: 110
  },
  input: ["Node_3"]
})

const node3Factory = (): Node => ({
  id: "Node_3",
  position: {
    x: 310,
    y: 510
  },
  children: <div>Node 3</div>,
  input: []
})

const initialNodes: Node[] = [
  {
    ...node1Factory()
  },
  {
    ...node2Factory()
  },
  {
    ...node3Factory()
  }
]

const pointPosition = { x: 30, y: -10 }
const inputPosition = { x: 0, y: -10 }

const App = () => {
  const [nodes, setNodes] = React.useState(initialNodes)
  const [selectionZone, setSelectionZone] = React.useState(null)
  const editorApi = React.useRef(null)

  React.useEffect(() => {
    EditorPublicApi.subscribe((val) => {
      editorApi.current = val
    })
  }, [])

  const onSelectionZoneChanged = React.useCallback((val) => setSelectionZone(val), [])

  const selectionZonePosition = React.useMemo(() => {
    const zoomContainerRect = editorApi.current?.zoomContainerRef?.current?.getBoundingClientRect()
    const left = zoomContainerRect?.left + selectionZone?.left * editorApi.current?.transformation.zoom || 0
    const top = zoomContainerRect?.top + selectionZone?.top * editorApi.current?.transformation.zoom || 0
    const right = zoomContainerRect?.left + selectionZone?.right * editorApi.current?.transformation.zoom || 0
    const bottom = zoomContainerRect?.top + selectionZone?.bottom * editorApi.current?.transformation.zoom || 0

    return {
      left,
      top,
      width: right - left,
      height: bottom - top
    }
  }, [selectionZone])

  return (
    <>
      <div style={{ height: "50px" }}>header</div>
      <div className="root">
        <div className="selection-zone" style={selectionZonePosition} />
        <div className="flow-menu">
          <div
            onClick={() => {
              const newNode = {
                id: "Node_" + Math.trunc(Math.random() * 1000),
                children: <div>Simple children</div>,
                position: {
                  x: 140 + Math.random() * 100,
                  y: 140 + Math.random() * 100
                },
                input: [],
                output: []
              }

              setNodes((nodes) => [...nodes, newNode])
            }}
          >
            Create new Node
          </div>
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
      </div>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
