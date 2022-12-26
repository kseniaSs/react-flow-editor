import { action } from "nanostores"

import { DRAG_OFFSET_TRANSFORM, LARGEST_RECT } from "@/Editor/constants"
import { nodeRect } from "@/Editor/helpers/nodeRect"

import { DragItemAtom } from "../DragItem"
import { NodesAtom } from "../Nodes"
import { TransformationMap } from "./store"

export const dragViewportHandler = action(
  TransformationMap,
  "dragViewportHandler",
  (store, e: React.MouseEvent<HTMLElement>) => {
    const dragItem = DragItemAtom.get()
    const transformation = store.get()

    const newPos = {
      x: (e.clientX - dragItem.x) / transformation.zoom,
      y: (e.clientY - dragItem.y) / transformation.zoom
    }

    store.set({
      ...transformation,
      dx: transformation.dx + newPos.x,
      dy: transformation.dy + newPos.y
    })
  }
)

const countDumensionsRect = () => {
  const zoom = TransformationMap.get().zoom
  const nodes = NodesAtom.get()

  return nodes.reduce(
    (acc, node) => {
      const rect = nodeRect(node)

      if (node.position.x > acc.rightPoint) acc.rightPoint = node.position.x + rect.width / zoom
      if (node.position.x < acc.leftPoint) acc.leftPoint = node.position.x
      if (node.position.y > acc.bottomPoint) acc.bottomPoint = node.position.y + rect.height / zoom
      if (node.position.y < acc.topPoint) acc.topPoint = node.position.y

      return acc
    },
    { ...LARGEST_RECT }
  )
}

export const overview = action(TransformationMap, "overview", (store, editorContainer: HTMLElement) => {
  const nodes = NodesAtom.get()

  if (!nodes.length) return

  const editorRect = editorContainer.getBoundingClientRect()
  const dimensionsRect = countDumensionsRect()

  const width = dimensionsRect.rightPoint - dimensionsRect.leftPoint
  const height = dimensionsRect.bottomPoint - dimensionsRect.topPoint

  const newZoom = Math.min(
    (editorRect.width - DRAG_OFFSET_TRANSFORM) / width,
    (editorRect.height - DRAG_OFFSET_TRANSFORM) / height
  )
  const newZoomCorrected = newZoom > 1 ? 1 : newZoom

  const dx = -dimensionsRect.leftPoint + (editorRect.width - width) / 2
  const dy = -dimensionsRect.topPoint + (editorRect.height - height) / 2

  store.set({
    dx,
    dy,
    zoom: newZoomCorrected
  })
})
