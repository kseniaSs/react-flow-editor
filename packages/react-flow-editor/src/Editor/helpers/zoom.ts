import { useStore } from "@nanostores/react"
import { useCallback, useMemo } from "react"
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "../constants"
import { DragItemAtom, TransformationAtom } from "../state"

export const useZoom = ({
  zoomContainerRef,
  editorContainerRef
}: {
  zoomContainerRef: React.RefObject<HTMLDivElement>
  editorContainerRef: React.RefObject<HTMLDivElement>
}) => {
  const currentDragItem = useStore(DragItemAtom)
  const transformation = useStore(TransformationAtom)

  const zoomRefPoint = useMemo(() => {
    const editorRect = editorContainerRef?.current?.getBoundingClientRect()

    return {
      x: -transformation.dx + (editorRect?.width || 0) / 2,
      y: -transformation.dy + (editorRect?.height || 0) / 2
    }
  }, [editorContainerRef?.current, transformation])

  if (zoomContainerRef?.current)
    zoomContainerRef.current.style.transformOrigin = `${zoomRefPoint.x}px ${zoomRefPoint.y}px`

  const onWheel: React.WheelEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (currentDragItem.type) return

      const zoomFactor = Math.pow(ZOOM_STEP, Math.sign(event.deltaY))
      const newZoom = transformation.zoom * zoomFactor

      TransformationAtom.set({
        ...transformation,
        zoom: newZoom > MAX_ZOOM ? MAX_ZOOM : newZoom < MIN_ZOOM ? MIN_ZOOM : newZoom
      })
    },
    [currentDragItem, transformation]
  )

  return { onWheel }
}
