import { useContext, useCallback, MutableRefObject, useMemo } from "react"
import { useRecoilValue } from "recoil"
import { useRecalculateRects } from "."
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "../constants"
import { EditorContext } from "../context"
import { dragItemState } from "../ducks/store"

export const useZoom = (
  zoomContainerRef?: MutableRefObject<HTMLDivElement>,
  editorContainerRef?: MutableRefObject<HTMLElement>
) => {
  const { transformation, setTransformation } = useContext(EditorContext)
  const currentDragItem = useRecoilValue(dragItemState)
  const recalculateRects = useRecalculateRects()

  const zoomRefPoint = useMemo(() => {
    const editorRect = editorContainerRef?.current?.getBoundingClientRect()

    return {
      x: -transformation.dx + (editorRect?.width || 0) / 2,
      y: -transformation.dy + (editorRect?.height || 0) / 2
    }
  }, [editorContainerRef.current, transformation])

  if (zoomContainerRef?.current)
    zoomContainerRef.current.style.transformOrigin = `${zoomRefPoint.x}px ${zoomRefPoint.y}px`

  const onWheel: React.WheelEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (currentDragItem.type) return

      const zoomFactor = Math.pow(ZOOM_STEP, Math.sign(event.deltaY))
      const newZoom = transformation.zoom * zoomFactor

      setTransformation({
        ...transformation,
        zoom: newZoom > MAX_ZOOM ? MAX_ZOOM : newZoom < MIN_ZOOM ? MIN_ZOOM : newZoom
      })
      recalculateRects()
    },
    [currentDragItem, transformation, recalculateRects]
  )

  return { onWheel }
}
