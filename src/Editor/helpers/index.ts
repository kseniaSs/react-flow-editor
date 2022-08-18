import { useCallback, useContext, useEffect, useRef, useMemo, useState } from "react"
import { Transformation } from "../../types"
import { DRAG_OFFSET_TRANSFORM, LARGEST_RECT } from "../constants"
import { EditorContext } from "../context"

export const resetEvent = (e: React.MouseEvent<HTMLElement>) => {
  e.stopPropagation()
  e.preventDefault()
}

export const useEditorMount = () => {
  const { onEditorRectsMounted, nodes, transformation, setTransformation } = useContext(EditorContext)
  const [underOverview, setUnderOverview] = useState<boolean>(false)

  const zoomContainerRef = useRef<HTMLDivElement | null>(null)
  const editorContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (underOverview) {
      if (nodes.length) {
        const editorRect = editorContainerRef?.current?.getBoundingClientRect()

        const dimensionsRect = nodes.reduce(
          (acc, node) => {
            if (node.position.x > acc.rightPoint)
              acc.rightPoint = node.position.x + node.rectPosition.width / transformation.zoom
            if (node.position.x < acc.leftPoint) acc.leftPoint = node.position.x
            if (node.position.y > acc.bottomPoint)
              acc.bottomPoint = node.position.y + node.rectPosition.height / transformation.zoom
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

        zoomContainerRef.current.style.transformOrigin = `${dx}px ${dy}px`

        setTransformation({
          dx,
          dy,
          zoom: newZoomCorrected
        })
      }

      setUnderOverview(false)
    }
  }, [underOverview, nodes, transformation, editorContainerRef])

  useEffect(() => {
    onEditorRectsMounted({ zoomContainerRef, editorContainerRef, overview: () => setUnderOverview(true) })
  }, [])

  return useMemo(
    () => ({ zoomContainerRef, editorContainerRef }),
    [zoomContainerRef.current, editorContainerRef.current]
  )
}

export const useRecalculateRects = () => {
  const { setNodes } = useContext(EditorContext)

  return useCallback(() => {
    setNodes((nodes) =>
      nodes.map((el) => ({ ...el, rectPosition: document.getElementById(el.id).getBoundingClientRect() }))
    )
  }, [setNodes])
}

export const TransformCanvasStyle = (transformation: Transformation) => ({
  transform: `translate(${transformation.dx}px, ${transformation.dy}px) scale(${transformation.zoom})`
})
