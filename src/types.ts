import { ChangeAction } from "./change-api"
import { Vector2d } from "./geometry"

export interface Size {
  width: number
  height: number
}

export interface Style {
  "react-flow-editor"?: string
  dot?: string
  input?: string
  output?: string
  left?: string
  right?: string
  connections?: string

  node?: string
  collapsed?: string
  expander?: string
  selected?: string

  header?: string
  icon?: string
  "arrow-down"?: string
  "arrow-right"?: string

  body?: string
  // alt: react-flow-creating-node
  "react-flow-creating-node"?: string

  grid?: string
}

export interface Config {
  resolver: (node: Node) => JSX.Element
  connectionValidator?: (output: { nodeId: string; port: number }, input: { nodeId: string; port: number }) => boolean
  /*
    Set Drag's area
    @default header
   */
  dragHandler?: "body" | "header"
  /**
   * Callback when changes to the Graph are made by the user
   * Call updateProps, if you want the editor managing the state change
   */
  onChanged?: (node: ChangeAction, updateProps: () => void) => void

  /**
   * If this is set, the editor will change the props.
   * @deprecated Use the "updateProps" in onChanged instead.
   */
  demoMode?: boolean
  /**
   * Default is 'bezier'
   */
  connectionType?: "bezier" | "linear"
  /**
   * Default is true. Which results in a grid.size of 18
   */
  grid?: boolean | { size: number }
  connectionAnchorsLength?: number
  /**
   * Default is 'we'
   */
  direction?: "ew" | "we"
  /**
   * Disables the zooming feature
   */
  disableZoom?: boolean
  /**
   * Classnames for postcss user
   */
  style?: Style
}

export interface Node {
  /**
   * Uniqle id
   */
  id: string
  input: InputPort
  output: OutputPort
  position: Vector2d
  rectPosition?: DOMRect
  classNames?: string[]
  children: JSX.Element
}

/**
 * Connection endpoint
 * Each connection is defined by a Port and a Connection
 * Which describes the Node+Port of the other endpoint of that connection
 */

export interface Connection {
  /**
   * The other node id which to connect
   */
  nodeId: string
  /**
   * Example UC: mark invalid connections
   */
  classNames?: string[]
}

export type InputPort = Connection[]

export type OutputPort = Connection[]
