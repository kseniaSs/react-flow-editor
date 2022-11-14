import { MutableRefObject, useContext } from "react"
import { useRecoilValue } from "recoil"
import { NodeState } from "@/types"
import { EditorContext } from "../../context"
import { dragItemState, svgOffsetState } from "../../ducks/store"
import { ItemType } from "../../types"
import { isNodeInSelectionZone } from "../selectionZone"
import { NewConnectionAtom, NodesAtom, SelectionZoneAtom } from "@/Editor/state"
import { useStore } from "@nanostores/react"

export const useDragTransformations = ({
  expandSelectionZone,
  zoomContainerRef
}: {
  expandSelectionZone: (e: React.MouseEvent) => void
  zoomContainerRef: MutableRefObject<HTMLElement>
}) => {
  const { transformation, setTransformation } = useContext(EditorContext)
  const nodes = useStore(NodesAtom)

  const currentDragItem = useRecoilValue(dragItemState)
  const svgOffset = useRecoilValue(svgOffsetState)
  const selectionZone = useStore(SelectionZoneAtom)

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
        x: (e.clientX - currentDragItem.x) / transformation.zoom,
        y: (e.clientY - currentDragItem.y) / transformation.zoom
      }

      setTransformation({
        ...transformation,
        dx: transformation.dx + newPos.x,
        dy: transformation.dy + newPos.y
      })
    },
    [ItemType.node]: (e: React.MouseEvent<HTMLElement>) => {
      NodesAtom.set(
        nodes.map((el) => {
          const isDragging = el.id === currentDragItem.id
          const isShiftSelected = e.shiftKey && el.state === NodeState.selected

          return isDragging || isShiftSelected
            ? {
                ...el,
                position: {
                  x: el.position.x + (e.clientX - currentDragItem.x) / transformation.zoom,
                  y: el.position.y + (e.clientY - currentDragItem.y) / transformation.zoom
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
