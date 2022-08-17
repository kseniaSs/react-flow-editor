import { isEqual } from "lodash"
import React, { useContext, useMemo } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { NodeState } from "../../../types"
import { BUTTON_LEFT, CLASSES } from "../../constants"
import { EditorContext, RectsContext } from "../../context"
import { dragItemState, newConnectionState, svgOffsetState } from "../../ducks/store"
import { resetEvent } from "../../helpers"
import { ItemType } from "../../types"
import { numberFallback } from "../Connections/helpers"
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
          state: node.id === nodeId ? NodeState.draggingConnector : null
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
      style={pointStyle(currentNode.outputPosition[numberFallback(pointInx, 0)], styleConfig?.point)}
      onMouseDown={setNode}
    />
  )
}, isEqual)
