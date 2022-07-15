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

export const dragItemState = atom<"node" | "connection" | "viewPort" | undefined>({
  key: "setDragItemAtom",
  default: undefined
})
