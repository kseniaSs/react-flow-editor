import { Node } from "@kseniass/react-flow-editor"
import { SimpleNode } from "./parts"

export const DEFAULT_OUTPUT = {
  x: 145,
  y: 30
}

const DEFAULT_OUTPUT_2 = {
  x: 145,
  y: 45
}

const DEFAULT_INPUT = {
  x: 0,
  y: 25
}

export const initialNodes: Node[] = [
  {
    id: "Node_1",
    children: SimpleNode({ expandable: true }),
    position: { x: 110, y: 110 },
    outputPosition: [DEFAULT_OUTPUT, DEFAULT_OUTPUT_2],
    outputNumber: 10,
    inputNumber: 10,
    inputPosition: DEFAULT_INPUT,
    next: ["Node_2"],
    state: null
  },
  {
    id: "Node_2",
    children: SimpleNode({ expandable: true }),
    position: { x: 310, y: 310 },
    outputPosition: [DEFAULT_OUTPUT, DEFAULT_OUTPUT_2],
    outputNumber: 10,
    inputNumber: 10,
    inputPosition: DEFAULT_INPUT,
    next: ["Node_3"],
    state: null
  },
  {
    id: "Node_3",
    children: SimpleNode({ expandable: false }),
    position: { x: 510, y: 510 },
    outputPosition: [DEFAULT_OUTPUT, DEFAULT_OUTPUT_2],
    outputNumber: 10,
    inputNumber: 10,
    inputPosition: DEFAULT_INPUT,
    next: [],
    state: null
  }
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

export const STYLED_CONFIG = {
  point: {
    width: 10,
    height: 10,
    color: "gray"
  },
  connector: {
    color: "gray"
  }
}
