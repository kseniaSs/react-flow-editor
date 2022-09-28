import { Node, Transformation } from "@kseniass/react-flow-editor"
import { SelectionZone } from "./types"
import { SimpleNode } from "./parts"
import { MutableRefObject } from "react"
import { DEFAULT_OUTPUT } from "./constants"

export const computeSelectionZone = (
  zoomContainerRef: MutableRefObject<HTMLDivElement> | undefined,
  transformation: Transformation,
  selectionZone: SelectionZone
): Partial<DOMRect> => {
  const zoomContainerRect = zoomContainerRef?.current.getBoundingClientRect()
  const left = zoomContainerRect?.left + selectionZone?.left * transformation.zoom || 0
  const top = zoomContainerRect?.top + selectionZone?.top * transformation.zoom || 0
  const right = zoomContainerRect?.left + selectionZone?.right * transformation.zoom || 0
  const bottom = zoomContainerRect?.top + selectionZone?.bottom * transformation.zoom || 0

  return {
    left,
    top,
    width: right - left,
    height: bottom - top
  }
}

export const nodeFactory = (): Node => ({
  id: `Node_${(Math.random() * 10000).toFixed()}`,
  position: { x: 140 + Math.random() * 100, y: 140 + Math.random() * 100 },
  inputNumber: 2,
  outputs: [{ id: `Out${(Math.random() * 10000).toFixed()}`, nextNodeId: null, position: DEFAULT_OUTPUT }],
  state: null
})
