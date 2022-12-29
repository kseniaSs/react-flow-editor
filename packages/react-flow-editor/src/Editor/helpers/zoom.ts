import { useStore } from "@nanostores/react"
import { useCallback, useMemo } from "react"

import { ZOOM_STEP } from "../constants"
import { DragItemAtom, TransformationMap } from "../state"
import { clampZoom } from "./clampZoom"
import { getRectFromRef } from "./getRectFromRef"

export const useZoom = ({
  zoomContainerRef,
  editorContainerRef
}: {
  zoomContainerRef: React.RefObject<HTMLDivElement>
  editorContainerRef: React.RefObject<HTMLDivElement>
}) => {
  const currentDragItem = useStore(DragItemAtom)
  const transformation = useStore(TransformationMap)

  const zoomRefPoint = useMemo(() => {
    const editorRect = getRectFromRef(editorContainerRef)

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

      const zoomFactor = Math.pow(ZOOM_STEP + 1, Math.sign(event.deltaY))

      TransformationMap.setKey("zoom", clampZoom(transformation.zoom * zoomFactor))
    },
    [currentDragItem, transformation]
  )

  return { onWheel }
}
