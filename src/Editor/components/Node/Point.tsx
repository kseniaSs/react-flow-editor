import { isEqual } from "lodash"
import React, { useContext } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { Node, NodeState, Output } from "../../../types"
import { BUTTON_LEFT } from "../../constants"
import { EditorContext, RectsContext } from "../../context"
import { dragItemState, newConnectionState, svgOffsetState } from "../../ducks/store"
import { resetEvent } from "../../helpers"
import { ItemType } from "../../types"
import { buildDotId, pointStyle } from "./helpers"

type PointProps = {
  node: Node
  output: Output
}

export const Point: React.FC<PointProps> = React.memo(({ node, output }) => {
  const { setNodes, styleConfig, transformation } = useContext(EditorContext)
  const { zoomContainerRef } = useContext(RectsContext)

  const [dragItem, setDragItem] = useRecoilState(dragItemState)
  const setNewConnectionState = useSetRecoilState(newConnectionState)
  const svgOffset = useRecoilValue(svgOffsetState)
  const zoomRect = zoomContainerRef?.current?.getBoundingClientRect()

  const setNode = (e: React.MouseEvent<HTMLElement>) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      setNodes((nodes) =>
        nodes.map((nodeItem) => ({
          ...nodeItem,
          state: nodeItem.id === node.id ? NodeState.draggingConnector : null
        }))
      )

      const pos = {
        x: -svgOffset.x + (e.clientX - zoomRect.left) / transformation.zoom,
        y: -svgOffset.y + (e.clientY - zoomRect.top) / transformation.zoom
      }

      setNewConnectionState(pos)

      setDragItem({
        type: ItemType.connection,
        output,
        id: node.id,
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  return (
    <div
      id={buildDotId(node.id)}
      className="dot"
      style={pointStyle({
        position: output.position,
        pointConfig: styleConfig?.point,
        node,
        dragItem,
        output
      })}
      onMouseDown={setNode}
    />
  )
}, isEqual)
