export type Size = {
  width: number
  height: number
}

export type Point = {
  x: number
  y: number
}

export type RectZone = {
  left: number
  right: number
  top: number
  bottom: number
}

export type SelectionZone = {
  cornerStart: Point
  cornerEnd: Point
}

export enum NodeState {
  dragging = "dragging",
  draggingConnector = "draggingConnector",
  selected = "selected",
  disabled = "disabled"
}

export type Output = {
  id: string
  position: Point
  nextNodeId: string | null
}

export type Transformation = {
  dx: number
  dy: number
  zoom: number
}

export type Node = {
  id: string
  outputs: Output[]
  position: Point
  rectPosition?: DOMRect
  inputPosition?: Point
  inputNumber: number
  state: NodeState | null
}

export type ConnectorStyleConfig = {
  color: string
  width: number
}

export type ScaleComponentProps = {
  zoomIn: () => void
  zoomOut: () => void
  overview: () => void
}

export type OutputComponentProps = {
  active: boolean
  nodeState: NodeState | null
}

export type MenuComponentProps = {
  setTransformation: (transformation: Transformation) => void
  transformation: Transformation
  zoomContainer: HTMLDivElement
  editorContainer: HTMLDivElement
}

export type EditorProps = {
  nodes: Node[]
  onNodesChange: (nodes: Node[]) => void
  NodeComponent: React.FC<Node>
  SelectionZoneComponent?: React.FC
  ScaleComponent?: React.FC<ScaleComponentProps>
  MenuComponent?: React.FC<MenuComponentProps>
  OutputComponent?: React.FC<OutputComponentProps>
  importantNodeIds?: Array<string>
  connectorStyleConfig?: ConnectorStyleConfig
}
