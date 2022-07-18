import { Vector2d } from "../geometry"
import { Size } from "../types"

export enum ItemType {
  node = "node",
  connection = "connection"
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

export type EditorState = {
  connectionState: Map<string, Vector2d>
  selection?: { type: ItemType; id: string }
  workingItem?: WorkItem
  transformation: { dx: number; dy: number; zoom: number }
  componentSize: Size
}
