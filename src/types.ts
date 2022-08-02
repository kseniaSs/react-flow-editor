import { MutableRefObject, SetStateAction } from "react"

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

export type Transformation = {
  dx: number
  dy: number
  zoom: number
}

export type SelectionZone = {
  cornerStart: Point
  cornerEnd: Point
}

export type NodeProps = NodeBase & {
  onSizeChanged: () => void
}

export type Node = NodeBase & {
  children: React.FC<NodeProps>
}

export type NodeBase = {
  id: string
  next: string[]
  position: Point
  rectPosition?: DOMRect
  isSelected?: boolean
  outputPosition?: Point
  inputPosition?: Point
  outputNumber?: number
  inputNumber?: number
}

export type OnEditorRectsMountedProps = {
  zoomContainerRef: MutableRefObject<HTMLDivElement>
  editorContainerRef: MutableRefObject<HTMLDivElement>
}

export type PointStyleConfig = {
  width: number
  height: number
  color: string
}

export type ConnectorStyleConfig = {
  color: string
  width: number
}

export type StyleConfig = {
  point?: PointStyleConfig
  connector?: ConnectorStyleConfig
}

export type EditorProps = {
  nodes: Node[]
  setNodes: (action: SetStateAction<Node[]>) => void
  transformation: Transformation
  setTransformation: (transformation: Transformation) => void
  onSelectionZoneChanged?: (value: RectZone) => void
  onEditorRectsMounted?: (value: OnEditorRectsMountedProps) => void
  styleConfig?: StyleConfig
}
