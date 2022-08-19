import { isEqual } from "lodash"
import React, { useContext } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { NodeState, Output } from "../../../types"
import { BUTTON_LEFT, CLASSES } from "../../constants"
import { EditorContext, RectsContext } from "../../context"
import { dragItemState, newConnectionState, svgOffsetState } from "../../ducks/store"
import { resetEvent } from "../../helpers"
import { ItemType } from "../../types"
import { buildDotId, pointStyle } from "./helpers"

type PointProps = {
  nodeId: string
  output: Output
}

export const Point: React.FC<PointProps> = React.memo(({ nodeId, output }) => {
  const { setNodes, styleConfig, transformation } = useContext(EditorContext)
  const { zoomContainerRef } = useContext(RectsContext)

  const setDragItem = useSetRecoilState(dragItemState)
  const setNewConnectionState = useSetRecoilState(newConnectionState)
  const svgOffset = useRecoilValue(svgOffsetState)
  const zoomRect = zoomContainerRef?.current?.getBoundingClientRect()

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
        output,
        id: nodeId,
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  return (
    <div
      id={buildDotId(nodeId)}
      className={CLASSES.DOT}
      style={pointStyle(output.position, styleConfig?.point)}
      onMouseDown={setNode}
    />
  )
}, isEqual)
