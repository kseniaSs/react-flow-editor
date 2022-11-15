import React, { FC, MutableRefObject } from "react"
import { cornersToRect } from "@/Editor/helpers/selectionZone"
import { SelectionZoneAtom, Transformation, TransformationAtom } from "@/Editor/state"
import { useStore } from "@nanostores/react"

export type SelectionZone = {
  left: number
  top: number
  right: number
  bottom: number
}

export const computeSelectionZone = (
  zoomContainerRef: MutableRefObject<HTMLDivElement | null>,
  transformation: Transformation,
  selectionZone: SelectionZone | null
): Partial<DOMRect> => {
  const zoomContainerRect = zoomContainerRef.current?.getBoundingClientRect()

  const left = (zoomContainerRect?.left || 0) + (selectionZone?.left || 0) * transformation.zoom || 0
  const top = (zoomContainerRect?.top || 0) + (selectionZone?.top || 0) * transformation.zoom || 0
  const right = (zoomContainerRect?.left || 0) + (selectionZone?.right || 0) * transformation.zoom || 0
  const bottom = (zoomContainerRect?.top || 0) + (selectionZone?.bottom || 0) * transformation.zoom || 0

  return {
    left,
    top,
    width: right - left,
    height: bottom - top
  }
}

type Props = {
  zoomContainerRef: MutableRefObject<HTMLDivElement | null>
}

export const SelectionZone: FC<Props> = ({ zoomContainerRef, children }) => {
  const transformation = useStore(TransformationAtom)
  const selectionZoneRect = cornersToRect(useStore(SelectionZoneAtom))

  const selectionZonePosition = computeSelectionZone(zoomContainerRef, transformation, selectionZoneRect)

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 1,
        pointerEvents: "none",
        ...selectionZonePosition
      }}
    >
      {children}
    </div>
  )
}
