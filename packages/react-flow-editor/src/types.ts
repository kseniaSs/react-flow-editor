import { MutableRefObject } from "react"

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
  connectorHovered = "connectorHovered",
  selected = "selected"
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

export type OnEditorRectsMountedProps = {
  zoomContainerRef: MutableRefObject<HTMLDivElement>
  editorContainerRef: MutableRefObject<HTMLDivElement>
  overview: () => void
}

export type PointStyleConfig = {
  width: number
  height: number
  color: string
  disconnectedColor: string
  disconnectedBg: string
}

export type ConnectorStyleConfig = {
  color: string
  width: number
}

export type StyleConfig = {
  point?: PointStyleConfig
  connector?: ConnectorStyleConfig
}

export type ScaleComponentProps = {
  zoomIn: () => void
  zoomOut: () => void
  overview: () => void
}

export type EditorProps = {
  nodes: Node[]
  onNodesChange: (nodes: Node[]) => void
  transformation: Transformation
  onTransfromationChange?: (tansformation: Transformation) => void
  NodeComponent: React.FC<Node>
  SelectionZoneComponent?: React.FC
  ScaleComponent?: React.FC<ScaleComponentProps>
  importantNodeIds?: Array<string>
  styleConfig?: StyleConfig
}
