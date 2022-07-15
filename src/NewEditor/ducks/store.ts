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
  key: "newConnectionAtom",
  default: undefined
})

export const dragItem = atom({
  key: "setDragItemAtom",
  default: ""
})

export const zoomState = atom({
  key: "zoomStateAtom",
  default: { zoom: 1, dx: 0, dy: 0 }
})
