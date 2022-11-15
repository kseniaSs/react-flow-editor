import { atom } from "recoil"
import { DragItemState } from "../types"

export const hoveredNodeIdState = atom<null | string>({
  key: "hoveredNodeId",
  default: null
})

export const dragItemState = atom<DragItemState>({
  key: "setDragItemAtom",
  default: { type: undefined, x: 0, y: 0 }
})
