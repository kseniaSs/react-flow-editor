import { NodeState } from "@/types"
import { ItemType } from "../../types"
import { isNodeInSelectionZone } from "../selectionZone"
import {
  DragItemAtom,
  NewConnectionAtom,
  NodesAtom,
  SelectionZoneAtom,
  SvgOffsetAtom,
  TransformationAtom
} from "@/Editor/state"
import { useStore } from "@nanostores/react"

export const useDragTransformations = ({
  expandSelectionZone,
  zoomContainerRef
}: {
  expandSelectionZone: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  zoomContainerRef: React.RefObject<HTMLDivElement>
}) => {
  const transformation = useStore(TransformationAtom)
  const nodes = useStore(NodesAtom)
  const svgOffset = useStore(SvgOffsetAtom)
  const selectionZone = useStore(SelectionZoneAtom)
  const dragItem = useStore(DragItemAtom)

  const zoomRect = zoomContainerRef?.current?.getBoundingClientRect()

  return {
    [ItemType.connection]: (e: React.MouseEvent<HTMLElement>) => {
      const newPos = {
        x: (e.clientX - zoomRect.left) / transformation.zoom - svgOffset.x,
        y: (e.clientY - zoomRect.top) / transformation.zoom - svgOffset.y
      }

      NewConnectionAtom.set(newPos)
    },

    [ItemType.viewPort]: (e: React.MouseEvent<HTMLElement>) => {
      const newPos = {
        x: (e.clientX - dragItem.x) / transformation.zoom,
        y: (e.clientY - dragItem.y) / transformation.zoom
      }

      TransformationAtom.set({
        ...transformation,
        dx: transformation.dx + newPos.x,
        dy: transformation.dy + newPos.y
      })
    },
    [ItemType.node]: (e: React.MouseEvent<HTMLElement>) => {
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
    [ItemType.selectionZone]: (e: React.MouseEvent<HTMLElement>) => {
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
