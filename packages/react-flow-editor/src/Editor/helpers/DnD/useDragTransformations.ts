import { useStore } from "@nanostores/react"

import { NodeState } from "@/types"
import {
  DragItemAtom,
  NewConnectionAtom,
  NodesAtom,
  SelectionZoneAtom,
  SvgOffsetAtom,
  TransformationMap
} from "@/Editor/state"

import { DragItemType } from "../../types"
import { isNodeInSelectionZone } from "../selectionZone"
import { getRectFromRef } from "../getRectFromRef"

export const useDragTransformations = ({
  expandSelectionZone,
  zoomContainerRef
}: {
  expandSelectionZone: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  zoomContainerRef: React.RefObject<HTMLDivElement>
}) => {
  const transformation = useStore(TransformationMap)
  const nodes = useStore(NodesAtom)
  const svgOffset = useStore(SvgOffsetAtom)
  const selectionZone = useStore(SelectionZoneAtom)
  const dragItem = useStore(DragItemAtom)

  const zoomRect = getRectFromRef(zoomContainerRef)

  return {
    [DragItemType.connection]: (e: React.MouseEvent<HTMLElement>) => {
      const newPos = {
        x: (e.clientX - zoomRect.left) / transformation.zoom - svgOffset.x,
        y: (e.clientY - zoomRect.top) / transformation.zoom - svgOffset.y
      }

      NewConnectionAtom.set(newPos)
    },

    [DragItemType.viewPort]: (e: React.MouseEvent<HTMLElement>) => {
      const newPos = {
        x: (e.clientX - dragItem.x) / transformation.zoom,
        y: (e.clientY - dragItem.y) / transformation.zoom
      }

      TransformationMap.set({
        ...transformation,
        dx: transformation.dx + newPos.x,
        dy: transformation.dy + newPos.y
      })
    },
    [DragItemType.node]: (e: React.MouseEvent<HTMLElement>) => {
      NodesAtom.set(
        nodes.map((el) => {
          const isDragging = el.id === dragItem.id
          const isShiftSelected = e.shiftKey && el.state === NodeState.selected

          return isDragging || isShiftSelected
            ? {
                ...el,
                position: {
                  x: el.position.x + (e.clientX - dragItem.x) / transformation.zoom,
                  y: el.position.y + (e.clientY - dragItem.y) / transformation.zoom
                },
                rectPosition: document.getElementById(el.id)?.getBoundingClientRect(),
                state: isShiftSelected ? NodeState.selected : NodeState.dragging
              }
            : { ...el, state: null }
        })
      )
    },
    [DragItemType.selectionZone]: (e: React.MouseEvent<HTMLElement>) => {
      expandSelectionZone(e)

      NodesAtom.set(
        nodes.map((el) => ({
          ...el,
          state: isNodeInSelectionZone(el, selectionZone, transformation) ? NodeState.selected : null
        }))
      )
    }
  }
}
