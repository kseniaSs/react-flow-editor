import { useStore } from "@nanostores/react"
import { useEffect, useState } from "react"

import { NodesAtom, TransformationMap } from "@/Editor/state"
import { DRAG_OFFSET_TRANSFORM, LARGEST_RECT } from "@/Editor/constants"
import { useRectsContext } from "@/Editor/rects-context"

export const useOverview = () => {
  const { zoomContainer, editorContainer } = useRectsContext()

  const nodes = useStore(NodesAtom)
  const transformation = useStore(TransformationMap)
  const [underOverview, setUnderOverview] = useState<boolean>(false)

  useEffect(() => {
    if (underOverview) {
      if (nodes.length) {
        const editorRect = editorContainer.getBoundingClientRect()

        const dimensionsRect = nodes.reduce(
          (acc, node) => {
            if (node.position.x > acc.rightPoint)
              acc.rightPoint = node.position.x + (node.rectPosition?.width || 0) / transformation.zoom
            if (node.position.x < acc.leftPoint) acc.leftPoint = node.position.x
            if (node.position.y > acc.bottomPoint)
              acc.bottomPoint = node.position.y + (node.rectPosition?.height || 0) / transformation.zoom
            if (node.position.y < acc.topPoint) acc.topPoint = node.position.y

            return acc
          },
          { ...LARGEST_RECT }
        )

        const width = dimensionsRect.rightPoint - dimensionsRect.leftPoint
        const height = dimensionsRect.bottomPoint - dimensionsRect.topPoint

        const newZoom = Math.min(
          (editorRect.width + DRAG_OFFSET_TRANSFORM) / width,
          (editorRect.height + DRAG_OFFSET_TRANSFORM) / height
        )
        const newZoomCorrected = newZoom > 1 ? 1 : newZoom

        const dx = -dimensionsRect.leftPoint + (editorRect.width - width) / 2
        const dy = -dimensionsRect.topPoint + (editorRect.height - height) / 2

        zoomContainer.style.transformOrigin = `${dx}px ${dy}px`

        TransformationMap.set({
          dx,
          dy,
          zoom: newZoomCorrected
        })
      }

      setUnderOverview(false)
    }
  }, [underOverview, nodes, transformation, editorContainer])

  /** Overview on mount */
  useEffect(() => {
    setUnderOverview(true)
  }, [])

  const overview = () => setUnderOverview(true)

  return overview
}
