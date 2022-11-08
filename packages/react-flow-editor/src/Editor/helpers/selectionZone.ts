import { MutableRefObject, useCallback, useContext, useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { Node, RectZone, SelectionZone, Transformation } from "../../types"
import { EditorContext } from "../context"
import { dragItemState, selectionZoneState } from "../ducks/store"

export const isNodeInSelectionZone = (node: Node, zone: SelectionZone, transform: Transformation): boolean => {
  const { left, top, right, bottom } = cornersToRect(zone)

  const isLeftOver = left < node.position.x + (node.rectPosition?.width || 0) / transform.zoom
  const isRightOver = right > node.position.x
  const isTopOver = top < node.position.y + (node.rectPosition?.height || 0) / transform.zoom
  const isBottomOver = bottom > node.position.y

  return isLeftOver && isRightOver && isTopOver && isBottomOver
}

export const cornersToRect = (zone: SelectionZone): RectZone =>
  zone
    ? {
        left: Math.min(zone.cornerStart.x, zone.cornerEnd.x),
        right: Math.max(zone.cornerStart.x, zone.cornerEnd.x),
        top: Math.min(zone.cornerStart.y, zone.cornerEnd.y),
        bottom: Math.max(zone.cornerStart.y, zone.cornerEnd.y)
      }
    : {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }

export const useSelectionZone = (zoomContainerRef: MutableRefObject<HTMLElement>) => {
  const [selectionZone, setSelectionZone] = useRecoilState(selectionZoneState)
  const { onSelectionZoneChanged, transformation } = useContext(EditorContext)
  const currentDragItem = useRecoilValue(dragItemState)

  useEffect(() => {
    onSelectionZoneChanged(cornersToRect(selectionZone))
  }, [selectionZone])

  const initSelectionZone = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (e.shiftKey && zoomContainerRef.current) {
        const zoomContainerRect = zoomContainerRef.current.getBoundingClientRect()
        const left = (e.clientX - zoomContainerRect.left) / transformation.zoom
        const top = (e.clientY - zoomContainerRect.top) / transformation.zoom
        const point = { x: left, y: top }

        setSelectionZone({ cornerStart: point, cornerEnd: point })
      }
    },
    [transformation.zoom, zoomContainerRef]
  )

  const expandSelectionZone = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setSelectionZone((zone) => {
        const deltaX = (e.clientX - currentDragItem.x) / transformation.zoom
        const deltaY = (e.clientY - currentDragItem.y) / transformation.zoom

        return {
          ...zone,
          cornerEnd: {
            x: zone.cornerEnd.x + deltaX,
            y: zone.cornerEnd.y + deltaY
          }
        }
      })
    },
    [currentDragItem, transformation.zoom, setSelectionZone]
  )

  return { initSelectionZone, expandSelectionZone }
}
