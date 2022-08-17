import { Point, Size } from "../types"

export enum ItemType {
  node = "node",
  connection = "connection",
  viewPort = "viewPort",
  selectionZone = "selectionZone"
}

export enum Axis {
  x = "x",
  y = "y"
}

export enum AutoScrollDirection {
  right = "right",
  left = "left",
  top = "top",
  bottom = "bottom"
}

export type AutoScrollState = { speed: number; direction: AutoScrollDirection }

export type SVGOffsetState = Point & Size

export type DragItemState = { type?: ItemType; nextId?: string; fromId?: string; id?: string } & Point

export type NodeGroupsRect = {
  leftPoint: number
  rightPoint: number
  topPoint: number
  bottomPoint: number
  realHeight: number
  realWidth: number
}

export type MountedContexts = {
  zoomContainerRef: React.MutableRefObject<HTMLDivElement>
  editorContainerRef: React.MutableRefObject<HTMLDivElement>
}
