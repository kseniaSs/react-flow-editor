import { Vector2d } from "../geometry"
import { Size } from "../types"

export enum ItemType {
  node = "node",
  connection = "connection",
  viewPort = "viewPort",
  selectionZone = "selectionZone"
}

export interface WorkItemConnection {
  type: ItemType.connection
  input: Vector2d
  output: Vector2d
}

export type WorkItem = WorkItemConnection

export type Point = {
  x: number
  y: number
}

export type Offset = {
  offsetTop: number
  offsetLeft: number
}

export type Transformation = { dx: number; dy: number; zoom: number }

export type EditorState = {
  connectionState: Map<string, Vector2d>
  selection?: { type: ItemType; id: string }
  workingItem?: WorkItem
  transformation: Transformation
  componentSize: Size
}

export enum AutoScrollDirection {
  right = "right",
  left = "left",
  top = "top",
  bottom = "bottom"
}

export enum Axis {
  x = "x",
  y = "y"
}

export type SelectionZone = {
  cornerStart: Point
  cornerEnd: Point
}
