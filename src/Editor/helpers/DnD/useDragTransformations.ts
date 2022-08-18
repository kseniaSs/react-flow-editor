import { MutableRefObject, useContext } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { useRecalculateRects } from ".."
import { NodeState } from "../../../types"
import { EditorContext } from "../../context"
import { dragItemState, newConnectionState, selectionZoneState, svgOffsetState } from "../../ducks/store"
import { ItemType } from "../../types"
import { isNodeInSelectionZone } from "../selectionZone"

export const useDragTransformations = ({
  expandSelectionZone,
  zoomContainerRef
}: {
  expandSelectionZone: (e: React.MouseEvent) => void
  zoomContainerRef: MutableRefObject<HTMLElement>
}) => {
  const { transformation, setNodes, setTransformation } = useContext(EditorContext)

  const currentDragItem = useRecoilValue(dragItemState)
  const setNewConnectionState = useSetRecoilState(newConnectionState)
  const svgOffset = useRecoilValue(svgOffsetState)
  const selectionZone = useRecoilValue(selectionZoneState)
  const recalculateRects = useRecalculateRects()

  const zoomRect = zoomContainerRef?.current?.getBoundingClientRect()

  return {
    [ItemType.connection]: (e: React.MouseEvent<HTMLElement>) => {
      const newPos = {
        x: (e.clientX - zoomRect.left) / transformation.zoom - svgOffset.x,
        y: (e.clientY - zoomRect.top) / transformation.zoom - svgOffset.y
      }

      setNewConnectionState(newPos)
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

      recalculateRects()
    },
    [ItemType.node]: (e: React.MouseEvent<HTMLElement>) => {
      setNodes((nodes) =>
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
                rectPosition: document.getElementById(el.id).getBoundingClientRect(),
                state: isShiftSelected ? NodeState.selected : NodeState.dragging
              }
            : { ...el, state: null }
        })
      )
    },
    [ItemType.selectionZone]: (e: React.MouseEvent<HTMLElement>) => {
      expandSelectionZone(e)

      setNodes((nodes) =>
        nodes.map((el) => ({
          ...el,
          state: isNodeInSelectionZone(el, selectionZone, transformation) ? NodeState.selected : null
        }))
      )
    }
  }
}
