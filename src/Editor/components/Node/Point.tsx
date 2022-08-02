import { isEqual } from "lodash"
import React, { useContext, useMemo } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { NodeState } from "../../../types"
import { RectsContext } from "../../Canvas"
import { BUTTON_LEFT, CLASSES } from "../../constants"
import { dragItemState, newConnectionState, svgOffsetState } from "../../ducks/store"
import { EditorContext } from "../../Editor"
import { resetEvent } from "../../helpers"
import { ItemType } from "../../types"
import { buildDotId, pointStyle } from "./helpers"

type PointProps = {
  nodeId: string
  nextId: string
}

export const Point: React.FC<PointProps> = React.memo(({ nodeId, nextId }) => {
  const { nodes, setNodes, styleConfig, transformation } = useContext(EditorContext)
  const { zoomContainerRef } = useContext(RectsContext)

  const setDragItem = useSetRecoilState(dragItemState)
  const setNewConnectionState = useSetRecoilState(newConnectionState)
  const svgOffset = useRecoilValue(svgOffsetState)
  const zoomRect = zoomContainerRef?.current?.getBoundingClientRect()

  const currentNode = useMemo(() => nodes.find((node) => node.id === nodeId), [nodes, nodeId])
  const pointInx = nextId ? currentNode.next.findIndex((id) => id === nextId) : currentNode.next.length

  const setNode = (e: React.MouseEvent<HTMLElement>) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          states: node.id === nodeId ? [NodeState.draggingConnector] : []
        }))
      )

      const pos = {
        x: -svgOffset.x + (e.clientX - zoomRect.left) / transformation.zoom,
        y: -svgOffset.y + (e.clientY - zoomRect.top) / transformation.zoom
      }

      setNewConnectionState(pos)

      setDragItem({
        type: ItemType.connection,
        nextId,
        fromId: nodeId,
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  return (
    <div
      id={buildDotId(nodeId)}
      className={CLASSES.DOT}
      style={pointStyle(currentNode.outputPosition[pointInx], styleConfig?.point)}
      onMouseDown={setNode}
    />
  )
}, isEqual)
