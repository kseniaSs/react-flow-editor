import { atom } from "recoil"
import { Node } from "../../types"

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

export const positionState = atom({
  key: "positionStateAtom",
  default: { x: 0, y: 0 }
})

type DragItemState = { type: "node" | "connection" | "viewPort" | undefined; x: number; y: number }

export const dragItemState = atom<DragItemState>({
  key: "setDragItemAtom",
  default: { type: undefined, x: 0, y: 0 }
})
