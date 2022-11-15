import {
  AutoScrollDirection,
  AutoScrollState,
  AutoScrollAtom,
  NodesAtom,
  autoScrollActions,
  NewConnectionAtom,
  SelectionZoneAtom,
  DragItemAtom,
  TransformationMap
} from "@/Editor/state"
import { useStore } from "@nanostores/react"
import { useCallback, useEffect } from "react"
import { NodeState } from "../../types"
import { DRAG_AUTO_SCROLL_DIST, DRAG_AUTO_SCROLL_TIME, DRAG_OFFSET_TRANSFORM } from "../constants"
import { Axis, ItemType } from "../types"
import { isNodeInSelectionZone } from "./selectionZone"

export const getSign = (axis: Axis, autoScroll: AutoScrollState): -1 | 0 | 1 => {
  if (axis === Axis.x && autoScroll.direction === AutoScrollDirection.left) return -1
  if (axis === Axis.x && autoScroll.direction === AutoScrollDirection.right) return 1

  if (axis === Axis.y && autoScroll.direction === AutoScrollDirection.top) return -1
  if (axis === Axis.y && autoScroll.direction === AutoScrollDirection.bottom) return 1

  return 0
}

const useCheckAutoScrollEnable = (editorContainerRef: React.RefObject<HTMLDivElement>) => {
  const autoScroll = useStore(AutoScrollAtom)

  return useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      const editorRect = editorContainerRef.current?.getBoundingClientRect()

      const leftOverflow = editorRect.left + DRAG_OFFSET_TRANSFORM - e.clientX
      const rightOverflow = e.clientX - (editorRect.right - DRAG_OFFSET_TRANSFORM)
      const topOverflow = editorRect.top + DRAG_OFFSET_TRANSFORM - e.clientY
      const bottomOverflow = e.clientY - (editorRect.bottom - DRAG_OFFSET_TRANSFORM)

      if (leftOverflow > 0) {
        AutoScrollAtom.set({ speed: leftOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.left })
      }

      if (rightOverflow > 0) {
        AutoScrollAtom.set({ speed: rightOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.right })
      }

      if (topOverflow > 0) {
        AutoScrollAtom.set({ speed: topOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.top })
      }

      if (bottomOverflow > 0) {
        AutoScrollAtom.set({ speed: bottomOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.bottom })
      }

      if (autoScroll.direction && Math.max(leftOverflow, rightOverflow, topOverflow, bottomOverflow) <= 0) {
        autoScrollActions.toDeafult()
      }
    },
    [autoScroll, editorContainerRef]
  )
}

export const useAutoScroll = (editorContainerRef: React.RefObject<HTMLDivElement>) => {
  const newConnection = useStore(NewConnectionAtom)
  const selectionZone = useStore(SelectionZoneAtom)
  const nodes = useStore(NodesAtom)
  const dragItem = useStore(DragItemAtom)
  const autoScroll = useStore(AutoScrollAtom)
  const transformation = useStore(TransformationMap)

  useEffect(() => {
    if (!autoScroll.direction) return

    const delta = DRAG_AUTO_SCROLL_DIST * autoScroll.speed * transformation.zoom

    const scroll = () => {
      if (dragItem.type && [ItemType.node, ItemType.connection, ItemType.selectionZone].includes(dragItem.type)) {
        const dx = transformation.dx - getSign(Axis.x, autoScroll) * delta
        const dy = transformation.dy - getSign(Axis.y, autoScroll) * delta

        TransformationMap.set({
          ...transformation,
          dx,
          dy
        })
      }

      if (dragItem.type === ItemType.connection) {
        NewConnectionAtom.set({
          x: newConnection.x + getSign(Axis.x, autoScroll) * delta,
          y: newConnection.y + getSign(Axis.y, autoScroll) * delta
        })
      }

      if (dragItem.type === ItemType.selectionZone && selectionZone !== null) {
        SelectionZoneAtom.set({
          ...selectionZone,
          cornerEnd: {
            x: selectionZone.cornerEnd.x + getSign(Axis.x, autoScroll) * delta,
            y: selectionZone.cornerEnd.y + getSign(Axis.y, autoScroll) * delta
          }
        })

        NodesAtom.set(
          nodes.map((el) => ({
            ...el,
            state: isNodeInSelectionZone(el, selectionZone!, transformation) ? NodeState.selected : null
          }))
        )
      }

      if (dragItem.type === ItemType.node) {
        const draggingNodesIds = nodes
          .filter((node) => node.state && [NodeState.dragging, NodeState.selected].includes(node.state))
          .map((node) => node.id)

        NodesAtom.set(
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
  }, [autoScroll, dragItem, newConnection, nodes, transformation, selectionZone])

  return useCheckAutoScrollEnable(editorContainerRef)
}
