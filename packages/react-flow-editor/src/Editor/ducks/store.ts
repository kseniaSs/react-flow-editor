import { atom } from "recoil"
import { DragItemState } from "../types"

export const dragItemState = atom<DragItemState>({
  key: "setDragItemAtom",
  default: { type: undefined, x: 0, y: 0 }
})
