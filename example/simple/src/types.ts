import { Node } from "@kseniass/react-flow-editor"
import { Transformation } from "@kseniass/react-flow-editor/dist/NewEditor/types"
import { MutableRefObject } from "react"

export type SelectionZone = {
  left: number
  top: number
  right: number
  bottom: number
}

export type PublicApiState = {
  transformation: Transformation
  setTransformation: (payload: Transformation) => void
  stateNodes: Node[]
  recalculateRects: () => void
  zoomContainerRef: MutableRefObject<HTMLDivElement>
}
