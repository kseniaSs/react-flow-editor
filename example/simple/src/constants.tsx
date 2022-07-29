import React from "react"
import { Node } from "@kseniass/react-flow-editor"

export const initialNodes: Node[] = [
  { id: "Node_1", children: <div>Node_1</div>, position: { x: 110, y: 110 }, input: ["Node_2"] },
  { id: "Node_2", children: <div>Node_2</div>, position: { x: 310, y: 110 }, input: ["Node_3"] },
  { id: "Node_3", children: <div>Node_3</div>, position: { x: 310, y: 510 }, input: [] }
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
