import React, { useCallback, useContext, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { Node, NodeState, Point } from "../../../types"
import { BUTTON_LEFT } from "../../constants"
import { EditorContext } from "../../context"
import { dragItemState, hoveredNodeIdState } from "../../ducks/store"
import { resetEvent } from "../../helpers"
import { ItemType } from "../../types"

export const useNodeInteractions = (node: Node) => {
  const { setNodes, nodes } = useContext(EditorContext)
  const [dragItem, setDragItem] = useRecoilState(dragItemState)
  const setHoveredNodeId = useSetRecoilState(hoveredNodeIdState)
  const [initialClickCoords, setInitialClickCoords] = useState<Point>({ x: 0, y: 0 })

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      resetEvent(e)
      if (e.button === BUTTON_LEFT) {
        const point = { x: e.clientX, y: e.clientY }
        setDragItem({ type: ItemType.node, ...point, id: node.id })

        setInitialClickCoords(point)
      }
    },
    [setNodes]
  )

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.button === BUTTON_LEFT) {
        setNodes((nodes) =>
          nodes.map((nodeItem) => {
            const isSelected =
              (nodeItem.id === node.id && initialClickCoords.x === e.clientX && initialClickCoords.y === e.clientY) ||
              (e.shiftKey && nodeItem.state === NodeState.dragging)

            if (isSelected) {
              return {
                ...nodeItem,
                state: NodeState.selected
              }
            }

            const isIdentity = e.shiftKey && nodeItem.state === NodeState.selected

            if (isIdentity) {
              return {
                ...nodeItem
              }
            }

            return {
              ...nodeItem,
              state: null
            }
          })
        )

        setDragItem({ type: undefined, x: e.clientX, y: e.clientY })
      }
    },
    [setNodes, initialClickCoords]
  )

  const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    const isNodeHovered = (nodeItem: Node) =>
      nodeItem.id === node.id &&
      dragItem.type === ItemType.connection &&
      dragItem.fromId !== node.id &&
      nodeItem.state !== NodeState.connectorHovered

    const needUpdateNodes = nodes.some(isNodeHovered)

    needUpdateNodes &&
      setNodes((nodes) =>
        nodes.map((nodeItem) => ({
          ...nodeItem,
          state: isNodeHovered(nodeItem) ? NodeState.connectorHovered : nodeItem.state
        }))
      )

    setHoveredNodeId(node.id)
  }, [setNodes, dragItem.fromId, nodes])

  const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    const isNodeLeavedWithConnector = (nodeItem: Node) =>
      nodeItem.id === node.id && dragItem.type === ItemType.connection && nodeItem.state !== NodeState.draggingConnector

    const needUpdateNodes = nodes.some(isNodeLeavedWithConnector)

    needUpdateNodes &&
      setNodes((nodes) =>
        nodes.map((nodeItem) => ({
          ...nodeItem,
          state: isNodeLeavedWithConnector(nodeItem) ? null : nodeItem.state
        }))
      )

    setHoveredNodeId(null)
  }, [setNodes, dragItem.type === ItemType.connection])

  return {
    onDragStarted,
    onMouseUp,
    onMouseEnter,
    onMouseLeave
  }
}
