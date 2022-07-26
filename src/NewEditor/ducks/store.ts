import { atom } from "recoil"
import { Node } from "../../types"
import { ItemType } from "../types"

export const nodesState = atom<Node[]>({
  key: "nodesStateAtom",
  default: []
})

export const selectedNodeState = atom({
  key: "selectedNodeAtom",
  default: ""
})

export const draggableNodeState = atom({
  key: "draggableNodeAtom",
  default: ""
})

export const newConnectionState = atom({
  key: "newConnectionState",
  default: { x: 0, y: 0 }
})

export const zoomState = atom({
  key: "zoomStateAtom",
  default: { zoom: 1, dx: 0, dy: 0 }
})

export const autoScrollState = atom({
  key: "autoScrollState",
  default: { speed: 0, direction: null }
})

export const offsetState = atom({
  key: "offsetState",
  default: { offsetTop: 0, offsetLeft: 0, maxRight: 0, maxBottom: 0 }
})

export const dotSizeState = atom({
  key: "dotSizeState",
  default: { width: 0, height: 0 }
})

export const pointPositionState = atom({
  key: "positionStateAtom",
  default: { x: 0, y: 0 }
})

export const svgOffsetState = atom({
  key: "svgOffsetState",
  default: { x: 0, y: 0, width: 0, height: 0 }
})

export const hoveredNodeIdState = atom({
  key: "hoveredNodeId",
  default: null
})

type DragItemState = { type?: ItemType; x: number; y: number }

export const dragItemState = atom<DragItemState>({
  key: "setDragItemAtom",
  default: { type: undefined, x: 0, y: 0 }
})
