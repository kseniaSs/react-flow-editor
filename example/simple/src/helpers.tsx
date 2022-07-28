import { Node } from "@kseniass/react-flow-editor"
import { PublicApiState, SelectionZone } from "./types"
import _ from "lodash"
import { NodeExpanded } from "./parts"

export const computeSelectionZone = (editorApi: PublicApiState, selectionZone: SelectionZone): Partial<DOMRect> => {
  const zoomContainerRect = editorApi?.zoomContainerRef?.current.getBoundingClientRect()
  const left = zoomContainerRect?.left + selectionZone?.left * editorApi?.transformation.zoom || 0
  const top = zoomContainerRect?.top + selectionZone?.top * editorApi?.transformation.zoom || 0
  const right = zoomContainerRect?.left + selectionZone?.right * editorApi?.transformation.zoom || 0
  const bottom = zoomContainerRect?.top + selectionZone?.bottom * editorApi?.transformation.zoom || 0

  return {
    left,
    top,
    width: right - left,
    height: bottom - top
  }
}

export const nodeFactory = (editorApi: PublicApiState): Node => ({
  id: `Node_${(Math.random() * 10000).toFixed()}`,
  children: <NodeExpanded recalculateRects={editorApi.recalculateRects} />,
  position: { x: 140 + Math.random() * 100, y: 140 + Math.random() * 100 },
  input: []
})

export const isNeedUpdate = (nodes: Node[], stateNodes: Node[]): boolean =>
  nodes.length === stateNodes.length &&
  !_.isEqual(
    nodes.map((node) => _.omit(node, ["children"])),
    stateNodes.map((node) => _.omit(node, ["children"]))
  )
