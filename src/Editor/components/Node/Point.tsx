import { isEqual } from "lodash"
import React, { useContext, useMemo } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { BUTTON_LEFT, CLASSES } from "../../constants"
import { dragItemState, newConnectionState, svgOffsetState } from "../../ducks/store"
import { EditorContext } from "../../Editor"
import { resetEvent } from "../../helpers"
import { ItemType } from "../../types"
import { buildDotId, pointStyle } from "./helpers"

type PointProps = {
  nodeId: string
}

export const Point: React.FC<PointProps> = React.memo(({ nodeId }) => {
  const { transformation, nodes, setNodes, styleConfig } = useContext(EditorContext)

  const setDragItem = useSetRecoilState(dragItemState)
  const setNewConnectionState = useSetRecoilState(newConnectionState)
  const svgOffset = useRecoilValue(svgOffsetState)

  const currentNode = useMemo(() => nodes.find((node) => node.id === nodeId), [nodes, nodeId])

  const setNode = (e: React.MouseEvent<HTMLElement>) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      setNodes((nodes) => nodes.map((node) => ({ ...node, isSelected: node.id === currentNode.id })))

      const pos = {
        x:
          -svgOffset.x +
          currentNode.position.x -
          (currentNode?.outputPosition?.x || 0) +
          currentNode.rectPosition.width / transformation.zoom,
        y:
          -svgOffset.y +
          currentNode.position.y -
          (currentNode?.outputPosition?.y || 0) +
          currentNode.rectPosition.height / transformation.zoom
      }

      setNewConnectionState(pos)

      setDragItem({
        type: ItemType.connection,
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  return (
    <div
      id={buildDotId(nodeId)}
      className={CLASSES.DOT}
      style={pointStyle(currentNode.outputPosition, styleConfig?.point)}
      onMouseDown={setNode}
    />
  )
}, isEqual)
