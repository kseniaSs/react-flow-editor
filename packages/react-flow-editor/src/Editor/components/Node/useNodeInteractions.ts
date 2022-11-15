import React, { useCallback, useState } from "react"
import { DragItemAtom, HoveredNodeIdAtom, NodesAtom } from "@/Editor/state"
import { useStore } from "@nanostores/react"
import { Node, NodeState, Point } from "@/types"
import { BUTTON_LEFT } from "../../constants"
import { resetEvent } from "../../helpers"
import { ItemType } from "../../types"

export const useNodeInteractions = (node: Node) => {
  const nodes = useStore(NodesAtom)
  const dragItem = useStore(DragItemAtom)
  const [initialClickCoords, setInitialClickCoords] = useState<Point>({ x: 0, y: 0 })

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = (e) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      const point = { x: e.clientX, y: e.clientY }
      DragItemAtom.set({ type: ItemType.node, ...point, id: node.id })

      setInitialClickCoords(point)
    }
  }

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.button === BUTTON_LEFT) {
        NodesAtom.set(
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

        DragItemAtom.set({ type: undefined, x: e.clientX, y: e.clientY })
      }
    },
    [initialClickCoords, nodes]
  )

  const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    const isNodeHovered = (nodeItem: Node) =>
      nodeItem.id === node.id &&
      dragItem.type === ItemType.connection &&
      dragItem.id !== node.id &&
      nodeItem.state !== NodeState.connectorHovered

    const needUpdateNodes = nodes.some(isNodeHovered)

    needUpdateNodes &&
      NodesAtom.set(
        nodes.map((nodeItem) => ({
          ...nodeItem,
          state: isNodeHovered(nodeItem) ? NodeState.connectorHovered : nodeItem.state
        }))
      )

    HoveredNodeIdAtom.set(node.id)
  }, [dragItem.id, nodes])

  const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = useCallback(() => {
    const isNodeLeavedWithConnector = (nodeItem: Node) =>
      nodeItem.id === node.id && dragItem.type === ItemType.connection && nodeItem.state !== NodeState.draggingConnector

    const needUpdateNodes = nodes.some(isNodeLeavedWithConnector)

    needUpdateNodes &&
      NodesAtom.set(
        nodes.map((nodeItem) => ({
          ...nodeItem,
          state: isNodeLeavedWithConnector(nodeItem) ? null : nodeItem.state
        }))
      )

    HoveredNodeIdAtom.set(null)
  }, [dragItem.type === ItemType.connection])

  return {
    onDragStarted,
    onMouseUp,
    onMouseEnter,
    onMouseLeave
  }
}
