import { atom } from "recoil"
import { SVGOffsetState, DragItemState } from "../types"

export const svgOffsetState = atom<SVGOffsetState>({
  key: "svgOffsetState",
  default: { x: 0, y: 0, width: 0, height: 0 }
})

export const hoveredNodeIdState = atom<null | string>({
  key: "hoveredNodeId",
  default: null
})

export const dragItemState = atom<DragItemState>({
  key: "setDragItemAtom",
  default: { type: undefined, x: 0, y: 0 }
})
