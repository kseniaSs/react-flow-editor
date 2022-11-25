import { Node } from "@kseniass/react-flow-editor"

import { DEFAULT_OUTPUT } from "./constants"

export const nodeFactory = (nodeName?: string): Node => ({
  id: nodeName || `Node_${(Math.random() * 10000).toFixed()}`,
  position: { x: 140 + Math.random() * 100, y: 140 + Math.random() * 100 },
  inputNumber: 2,
  outputs: [{ id: `Out${(Math.random() * 10000).toFixed()}`, nextNodeId: null, position: DEFAULT_OUTPUT }],
  state: null
})
