import { atom } from "recoil"

export const gridState = atom({
  key: "gridSizeAtom",
  default: { width: 0, height: 0 }
})

export const nodesState = atom({
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
