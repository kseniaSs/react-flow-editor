import React, { useCallback, useContext, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { Node, NodeState, Point } from "../../../types"
import { BUTTON_LEFT } from "../../constants"
import { dragItemState, hoveredNodeIdState } from "../../ducks/store"
import { EditorContext } from "../../Editor"
import { resetEvent } from "../../helpers"
import { ItemType } from "../../types"

export const useNodeInteractions = (node: Node) => {
  const { setNodes } = useContext(EditorContext)
  const [dragItem, setDragItem] = useRecoilState(dragItemState)
  const setHoveredNodeId = useSetRecoilState(hoveredNodeIdState)
  const [initialClickCoords, setInitialClickCoords] = useState<Point>({ x: 0, y: 0 })

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      resetEvent(e)
      if (e.button === BUTTON_LEFT) {
        const point = { x: e.clientX, y: e.clientY }
        setDragItem({ type: ItemType.node, ...point })

        setNodes((nodes) =>
          nodes.map((nodeItem) => ({
            ...nodeItem,
            states:
              nodeItem.id === node.id || (e.shiftKey && nodeItem.states.includes(NodeState.selected))
                ? [NodeState.dragging]
                : []
          }))
        )

        setInitialClickCoords(point)
      }
    },
    [setNodes]
  )

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.button === BUTTON_LEFT) {
        setNodes((nodes) =>
          nodes.map((nodeItem) => ({
            ...nodeItem,
            states:
              (nodeItem.id === node.id && initialClickCoords.x === e.clientX && initialClickCoords.y === e.clientY) ||
              (e.shiftKey && nodeItem.id !== node.id && nodeItem.states.includes(NodeState.dragging))
                ? [NodeState.selected]
                : []
          }))
        )

        setDragItem({ type: undefined, x: e.clientX, y: e.clientY })
      }
    },
    [setNodes, dragItem]
  )

  const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((nodeItem) => ({
        ...nodeItem,
        states:
          nodeItem.id === node.id &&
          dragItem.type === ItemType.connection &&
          dragItem.fromId !== node.id &&
          !nodeItem.states.includes(NodeState.connectorHovered)
            ? [NodeState.connectorHovered]
            : nodeItem.states
      }))
    )

    setHoveredNodeId(node.id)
  }, [setNodes, dragItem])

  const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((nodeItem) => ({
        ...nodeItem,
        states:
          nodeItem.id === node.id && dragItem.type === ItemType.connection
            ? nodeItem.states.filter((state) => state !== NodeState.connectorHovered)
            : nodeItem.states
      }))
    )

    setHoveredNodeId(null)
  }, [setNodes, dragItem])

  return {
    onDragStarted,
    onMouseUp,
    onMouseEnter,
    onMouseLeave
  }
}
