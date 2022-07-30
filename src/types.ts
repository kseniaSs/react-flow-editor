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

export type ChildrenProps = Omit<Node, "children"> & { onSizeChanged: () => void }

export type Node = {
  id: string
  next: string[]
  position: Point
  children: React.FC<ChildrenProps>
  rectPosition?: DOMRect
  isSelected?: boolean
  outputPosition?: Point
  inputPosition?: Point
}

export type onEditorRectsMountedProps = {
  zoomContainerRef: MutableRefObject<HTMLDivElement>
  editorContainerRef: MutableRefObject<HTMLDivElement>
}

export type EditorProps = {
  nodes: Node[]
  setNodes: (action: SetStateAction<Node[]>) => void
  transformation: Transformation
  setTransformation: (transformation: Transformation) => void
  isSingleOutputConnection?: boolean
  onSelectionZoneChanged?: (value: RectZone) => void
  onEditorRectsMounted?: (value: onEditorRectsMountedProps) => void
}
