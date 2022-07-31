import { useContext, useCallback } from "react"
import { useRecoilValue } from "recoil"
import { ZOOM_STEP } from "../constants"
import { dragItemState } from "../ducks/store"
import { EditorContext } from "../Editor"

export const useZoom = () => {
  const { transformation, setTransformation } = useContext(EditorContext)
  const currentDragItem = useRecoilValue(dragItemState)

  const onWheel: React.WheelEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (currentDragItem.type) return

      const zoomFactor = Math.pow(ZOOM_STEP, Math.sign(event.deltaY))
      const zoom = transformation.zoom * zoomFactor

      setTransformation({ ...transformation, zoom })
    },
    [currentDragItem, transformation]
  )

  return { onWheel }
}
