import * as React from "react"
import * as ReactDOM from "react-dom"

import { Editor, Node, Config, EditorPublicApi } from "@kseniass/react-flow-editor"
import "./simple.scss"

type LogProps = { subscribe: (update: (log: string) => void) => void }
type LogState = { content: string }

class Log extends React.Component<LogProps, LogState> {
  constructor(props: LogProps) {
    super(props)
    this.state = { content: "" }
    props.subscribe(this.update.bind(this))
  }

  private update(log: string) {
    this.setState({ content: log })
  }

  render() {
    return (
      <div className="log">
        <p>{this.state.content}</p>
      </div>
    )
  }
}

type NodeAttributesProps = { subscribe: (update: (node: Node | null) => void) => void }
type NodeAttributesState = { node: Node | null }
class NodeAttributes extends React.Component<NodeAttributesProps, NodeAttributesState> {
  constructor(props: any) {
    super(props)
    this.state = { node: null }
    props.subscribe(this.update.bind(this))
  }

  private update(node: Node | null) {
    this.setState({ node: node })
  }

  render() {
    return (
      <div>
        <h2>Node Attributes</h2>
        <p>{this.state.node === null ? "No node selected" : "Data: " + JSON.stringify(this.state.node.payload.data)}</p>
      </div>
    )
  }
}

const NodeExpanded: React.FC<{ recalculateRects?: () => void }> = ({ recalculateRects }) => {
  const [height, setHeight] = React.useState(50)

  React.useEffect(() => {
    recalculateRects && recalculateRects()
  }, [height])

  return (
    <div onClick={() => setHeight(height === 50 ? 150 : 50)} style={{ height: `${height}px` }}>
      Node
    </div>
  )
}

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

function resolver(node: Node): JSX.Element {
  if (node.payload.type === "") return <h2 />
  return <p style={{ height: "100px", width: "60px" }}>{node.payload.h1}</p>
}

let log: (log: string) => void = undefined
let attributes: (node: Node | null) => void = undefined
const onChanged: Config["onChanged"] = (data) => {
  if (log === undefined) return
  if (data.type === "ConnectionRemoved") log(`Connection '${data.id}' was removed.`)
  else if (data.type === "NodeRemoved") log(`Node '${data.id}' was removed.`)
  else if (data.type === "NodeCreated") log(`Node '${data.node.id}' was created.`)
  else if (data.type === "ConnectionCreated")
    log(
      `New connection between nodes '${data.input.nodeId}' [${data.input.port}]  and '${data.output.nodeId}' [${data.output.port}] created.`
    )
  else if (data.type === "NodeCollapseChanged")
    log(`Collapse state of Node '${data.id}' is now ${data.shouldBeCollapsed}.`)
  else if (data.type === "NodeSelected") {
    log(`Node selected: '${data.node.id}'.`)
    attributes(data.node)
  } else if (data.type === "NodeDeselected") {
    log(`Node deselected.`)
    attributes(null)
  }
}

const config: Config = {
  resolver,
  connectionType: "bezier",
  dragHandler: "body",
  onChanged,
  grid: true,
  demoMode: true,
  direction: "we"
}

const pointPosition = { x: 30, y: -10 }
const inputPosition = { x: 0, y: -10 }

const App = () => {
  const [nodes, setNodes] = React.useState(initialNodes)
  const [selectionZone, setSelectionZone] = React.useState(null)
  const editorApi = React.useRef(null)

  React.useEffect(() => {
    EditorPublicApi.subscribe((val) => {
      console.log(val)

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

          {/*<div*/}
          {/*  onClick={() =>*/}
          {/*    createNewNode(node2Factory(), {*/}
          {/*      x: editorProps.editorBoundingRect.width / 2,*/}
          {/*      y: editorProps.editorBoundingRect.height / 2*/}
          {/*    })*/}
          {/*  }*/}
          {/*>*/}
          {/*  Create new Node 2*/}
          {/*</div>*/}

          {/*<div*/}
          {/*  onClick={() =>*/}
          {/*    createNewNode(node3Factory(), {*/}
          {/*      x: editorProps.editorBoundingRect.width / 2,*/}
          {/*      y: editorProps.editorBoundingRect.height / 2*/}
          {/*    })*/}
          {/*  }*/}
          {/*>*/}
          {/*  Create new Node 3*/}
          {/*</div>*/}
        </div>
        <div
          className="react-editor-container"
          // onWheel={onWheel}
        >
          <Editor
            nodes={nodes}
            pointPosition={pointPosition}
            isSingleOutputConnection
            inputPosition={inputPosition}
            onSelectionZoneChanged={onSelectionZoneChanged}
          />
        </div>
        <div className="node-attributes">
          <NodeAttributes subscribe={(update) => (attributes = update)} />
        </div>

        <Log subscribe={(update) => (log = update)} />
      </div>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
