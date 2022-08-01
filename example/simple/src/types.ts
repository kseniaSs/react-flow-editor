import { NodeProps } from "@kseniass/react-flow-editor"

export type SelectionZone = {
  left: number
  top: number
  right: number
  bottom: number
}

export type SimpleNodeProps = NodeProps & { expandable: boolean }
