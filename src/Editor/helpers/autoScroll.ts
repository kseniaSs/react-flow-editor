import { MutableRefObject, useCallback, useContext, useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { NodeState } from "../../types"
import { DRAG_AUTO_SCROLL_DIST, DRAG_AUTO_SCROLL_TIME, DRAG_OFFSET_TRANSFORM } from "../constants"
import { EditorContext } from "../context"
import { autoScrollState, dragItemState, newConnectionState, selectionZoneState } from "../ducks/store"
import { AutoScrollDirection, Axis, ItemType } from "../types"
import { isNodeInSelectionZone } from "./selectionZone"

export const getSign = (axis: Axis, autoScroll): -1 | 0 | 1 => {
  if (axis === Axis.x && autoScroll.direction === AutoScrollDirection.left) return -1
  if (axis === Axis.x && autoScroll.direction === AutoScrollDirection.right) return 1

  if (axis === Axis.y && autoScroll.direction === AutoScrollDirection.top) return -1
  if (axis === Axis.y && autoScroll.direction === AutoScrollDirection.bottom) return 1

  return 0
}

const useCheckAutoScrollEnable = (editorContainerRef: MutableRefObject<HTMLElement>) => {
  const [autoScroll, setAutoScroll] = useRecoilState(autoScrollState)

  return useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const editorRect = editorContainerRef.current?.getBoundingClientRect()

      const leftOverflow = editorRect.left + DRAG_OFFSET_TRANSFORM - e.clientX
      const rightOverflow = e.clientX - (editorRect.right - DRAG_OFFSET_TRANSFORM)
      const topOverflow = editorRect.top + DRAG_OFFSET_TRANSFORM - e.clientY
      const bottomOverflow = e.clientY - (editorRect.bottom - DRAG_OFFSET_TRANSFORM)

      if (leftOverflow > 0) {
        setAutoScroll({ speed: leftOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.left })
      }

      if (rightOverflow > 0) {
        setAutoScroll({ speed: rightOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.right })
      }

      if (topOverflow > 0) {
        setAutoScroll({ speed: topOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.top })
      }

      if (bottomOverflow > 0) {
        setAutoScroll({ speed: bottomOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.bottom })
      }

      if (autoScroll.direction && Math.max(leftOverflow, rightOverflow, topOverflow, bottomOverflow) <= 0) {
        setAutoScroll({ speed: 0, direction: null })
      }
    },
    [autoScroll, editorContainerRef]
  )
}

export const useAutoScroll = (editorContainerRef: MutableRefObject<HTMLElement>) => {
  const [newConnection, setNewConnectionState] = useRecoilState(newConnectionState)
  const [selectionZone, setSelectionZone] = useRecoilState(selectionZoneState)
  const currentDragItem = useRecoilValue(dragItemState)
  const autoScroll = useRecoilValue(autoScrollState)

  const { nodes, transformation, setNodes, setTransformation } = useContext(EditorContext)

  useEffect(() => {
    if (!autoScroll.direction) return

    const delta = DRAG_AUTO_SCROLL_DIST * autoScroll.speed * transformation.zoom

    const scroll = () => {
      if ([ItemType.node, ItemType.connection, ItemType.selectionZone].includes(currentDragItem.type)) {
        const dx = transformation.dx - getSign(Axis.x, autoScroll) * delta
        const dy = transformation.dy - getSign(Axis.y, autoScroll) * delta

        setTransformation({
          ...transformation,
          dx,
          dy
        })
      }

      if (currentDragItem.type === ItemType.connection) {
        setNewConnectionState({
          x: newConnection.x + getSign(Axis.x, autoScroll) * delta,
          y: newConnection.y + getSign(Axis.y, autoScroll) * delta
        })
      }

      if (currentDragItem.type === ItemType.selectionZone) {
        setSelectionZone((zone) => ({
          ...zone,
          cornerEnd: {
            x: zone.cornerEnd.x + getSign(Axis.x, autoScroll) * delta,
            y: zone.cornerEnd.y + getSign(Axis.y, autoScroll) * delta
          }
        }))

        setNodes((nodes) =>
          nodes.map((el) => ({
            ...el,
            state: isNodeInSelectionZone(el, selectionZone, transformation) ? NodeState.selected : null
          }))
        )
      }

      if (currentDragItem.type === ItemType.node) {
        const draggingNodesIds = nodes
          .filter((node) => [NodeState.dragging, NodeState.selected].includes(node.state))
          .map((node) => node.id)

        setNodes((nodes) =>
          nodes.map((el) =>
            draggingNodesIds.includes(el.id)
              ? {
                  ...el,
                  position: {
                    x: el.position.x + getSign(Axis.x, autoScroll) * delta,
                    y: el.position.y + getSign(Axis.y, autoScroll) * delta
                  }
                }
              : el
          )
        )
      }
    }

    const scrollInterval = setInterval(scroll, DRAG_AUTO_SCROLL_TIME)

    return () => clearInterval(scrollInterval)
  }, [autoScroll, currentDragItem, newConnection, nodes, transformation, selectionZone, setNodes, setSelectionZone])

  return useCheckAutoScrollEnable(editorContainerRef)
}
