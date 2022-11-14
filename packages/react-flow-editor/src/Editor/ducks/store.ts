import { atom } from "recoil"
import { SelectionZone } from "../../types"
import { SVGOffsetState, DragItemState } from "../types"

export const selectionZoneState = atom<SelectionZone | null>({
  key: "selectionZoneState",
  default: null
})

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
