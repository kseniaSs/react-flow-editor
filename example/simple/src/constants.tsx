import { Node } from "@kseniass/react-flow-editor"
import { SimpleNode } from "./parts"

export const initialNodes: Node[] = [
  { id: "Node_1", children: SimpleNode({ expandable: true }), position: { x: 110, y: 110 }, next: ["Node_2"] },
  { id: "Node_2", children: SimpleNode({ expandable: true }), position: { x: 310, y: 310 }, next: ["Node_3"] },
  { id: "Node_3", children: SimpleNode({ expandable: false }), position: { x: 510, y: 510 }, next: [] }
]

export const pointPosition = { x: 30, y: -10 }
export const inputPosition = { x: 0, y: -10 }

export const TIPS = `
  - DnD to move canvas or nodes\n
  - Available autoScroll when DnD connection or nodes\n
  - Multiple Selection with SHIFT + click nodes\n
  - Multiple Selection with SHIFT and dragging select zone\n
  - Delete (multiple too) selected nodes with DELETE/BACKSPACE\n
  - DnD multiple selected nodes with SHIFT\n
  - Scroll mouse to zoom
`
