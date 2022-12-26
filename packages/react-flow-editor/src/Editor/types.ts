export enum DragItemType {
  node = "node",
  connection = "connection",
  viewPort = "viewPort",
  selectionZone = "selectionZone"
}

export enum Axis {
  x = "x",
  y = "y"
}

export type NodeGroupsRect = {
  leftPoint: number
  rightPoint: number
  topPoint: number
  bottomPoint: number
  realHeight: number
  realWidth: number
}

export type MountedContexts = {
  zoomContainer: HTMLDivElement | null
  editorContainer: HTMLDivElement | null
}
