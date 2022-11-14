import { useStore } from "@nanostores/react"
import { MutableRefObject, useCallback, useContext, useEffect } from "react"
import { useRecoilValue } from "recoil"
import { Node, RectZone, SelectionZone, Transformation } from "../../types"
import { EditorContext } from "../context"
import { dragItemState } from "../ducks/store"
import { SelectionZoneAtom } from "../state"

export const isNodeInSelectionZone = (node: Node, zone: SelectionZone | null, transform: Transformation): boolean => {
  if (zone === null) return false

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
  const selectionZone = useStore(SelectionZoneAtom)
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

        SelectionZoneAtom.set({ cornerStart: point, cornerEnd: point })
      }
    },
    [transformation.zoom, zoomContainerRef]
  )

  const expandSelectionZone = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (selectionZone) {
        const deltaX = (e.clientX - currentDragItem.x) / transformation.zoom
        const deltaY = (e.clientY - currentDragItem.y) / transformation.zoom

        SelectionZoneAtom.set({
          ...selectionZone,
          cornerEnd: {
            x: selectionZone.cornerEnd.x + deltaX,
            y: selectionZone.cornerEnd.y + deltaY
          }
        })
      }
    },
    [currentDragItem, transformation.zoom]
  )

  return { initSelectionZone, expandSelectionZone }
}
