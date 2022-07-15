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
  default: undefined
})

export const zoomState = atom({
  key: "zoomStateAtom",
  default: { zoom: 1, dx: 0, dy: 0 }
})

export const dragItem = atom({
  key: "setDragItemAtom",
  default: ""
})
