import { useStore } from "@nanostores/react"
import { RefObject, useCallback } from "react"

import { AutoScrollAtom, AutoScrollDirection, DragItemAtom, SelectionZoneAtom, TransformationMap } from "../state"
import { getRectFromRef } from "./getRectFromRef"

export const useSelectionZone = (zoomContainerRef: RefObject<HTMLElement>) => {
  const selectionZone = useStore(SelectionZoneAtom)

  const initSelectionZone = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (e.shiftKey) {
        const transformation = TransformationMap.get()
        const zoomContainerRect = getRectFromRef(zoomContainerRef)

        const left = (e.clientX - zoomContainerRect.left) / transformation.zoom
        const top = (e.clientY - zoomContainerRect.top) / transformation.zoom
        const point = { x: left, y: top }

        SelectionZoneAtom.set({ cornerStart: point, cornerEnd: point })
      }
    },
    [zoomContainerRef]
  )

  const expandSelectionZone = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (selectionZone) {
        const transformation = TransformationMap.get()
        const dragItem = DragItemAtom.get()
        const autoScroll = AutoScrollAtom.get()

        const deltaX = (e.clientX - dragItem.x) / transformation.zoom
        const deltaY = (e.clientY - dragItem.y) / transformation.zoom

        SelectionZoneAtom.set({
          ...selectionZone,
          cornerEnd: {
            x:
              selectionZone.cornerEnd.x +
              ([AutoScrollDirection.left, AutoScrollDirection.right].includes(autoScroll.direction!) ? 0 : deltaX),
            y:
              selectionZone.cornerEnd.y +
              ([AutoScrollDirection.top, AutoScrollDirection.bottom].includes(autoScroll.direction!) ? 0 : deltaY)
          }
        })
      }
    },
    [selectionZone]
  )

  return { initSelectionZone, expandSelectionZone }
}
