import { atom } from "recoil"
import { Point, SelectionZone } from "../../types"
import { AutoScrollState, SVGOffsetState, DragItemState } from "../types"

export const newConnectionState = atom<Point>({
  key: "newConnectionState",
  default: { x: 0, y: 0 }
})

export const autoScrollState = atom<AutoScrollState>({
  key: "autoScrollState",
  default: { speed: 0, direction: null }
})

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
