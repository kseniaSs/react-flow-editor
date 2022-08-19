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
    inputNumber: 10,
    inputPosition: DEFAULT_INPUT,
    outputs: [
      { id: "N_1_1", nextNodeId: "Node_2", position: DEFAULT_OUTPUT },
      { id: "N_1_2", nextNodeId: null, position: DEFAULT_OUTPUT_2 }
    ],
    state: null
  },
  {
    id: "Node_2",
    children: SimpleNode({ expandable: true }),
    position: { x: 310, y: 310 },
    inputNumber: 10,
    inputPosition: DEFAULT_INPUT,
    outputs: [{ id: "N_2_1", nextNodeId: "Node_3", position: DEFAULT_OUTPUT }],
    state: null
  },
  {
    id: "Node_3",
    children: SimpleNode({ expandable: false }),
    position: { x: 510, y: 510 },
    inputNumber: 10,
    inputPosition: DEFAULT_INPUT,
    outputs: [
      { id: "N_3_1", nextNodeId: null, position: DEFAULT_OUTPUT },
      { id: "N_3_2", nextNodeId: null, position: DEFAULT_OUTPUT_2 }
    ],
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
    color: "rgb(125 125 125)",
    disconnectedColor: "#ccc",
    disconnectedBg: "#fafafa"
  },
  connector: {
    color: "rgb(125 125 125)"
  }
}
