import { Output, Point } from "../types"

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

export type DragItemState = { type?: ItemType; output?: Output; id?: string } & Point

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
