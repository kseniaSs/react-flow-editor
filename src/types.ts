import { Vector2d } from "./geometry"

export interface Size {
  width: number
  height: number
}

export interface Node {
  /**
   * Uniqle id
   */
  id: string
  input: InputPort
  position: Vector2d
  classNames?: string[]
  children: JSX.Element
  rectPosition?: DOMRect
  isSelected?: boolean
}

/**
 * Connection endpoint
 * Each connection is defined by a Port and a Connection
 * Which describes the Node+Port of the other endpoint of that connection
 */

export type InputPort = Array<string>
