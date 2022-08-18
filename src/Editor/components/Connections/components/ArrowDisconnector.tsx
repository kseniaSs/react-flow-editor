import { isEqual } from "lodash"
import React, { useCallback, useContext } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { NodeState, Point } from "../../../../types"
import { CLASSES } from "../../../constants"
import { EditorContext, RectsContext } from "../../../context"
import { dragItemState, newConnectionState, svgOffsetState } from "../../../ducks/store"
import { ItemType } from "../../../types"
import { disconnectorStyle } from "../helpers"

type DisconnectorProps = {
  position: Point
  fromId: string
  nextId: string
}

const ArrowDisconnector: React.FC<DisconnectorProps> = ({ position, fromId, nextId }) => {
  const { zoomContainerRef } = useContext(RectsContext)
  const { transformation, setNodes } = useContext(EditorContext)
  const svgOffset = useRecoilValue(svgOffsetState)
  const setNewConnectionState = useSetRecoilState(newConnectionState)

  const setDragItem = useSetRecoilState(dragItemState)

  const onMouseDown = useCallback(
    (e) => {
      e.stopPropagation()

      setDragItem({
        type: ItemType.connection,
        nextId,
        fromId,
        x: e.clientX,
        y: e.clientY
      })

      const zoomRect = zoomContainerRef.current?.getBoundingClientRect()

      const newPos = {
        x: (e.clientX - zoomRect.left) / transformation.zoom - svgOffset.x,
        y: (e.clientY - zoomRect.top) / transformation.zoom - svgOffset.y
      }

      setNewConnectionState(newPos)

      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          state: node.id === fromId ? NodeState.draggingConnector : null
        }))
      )
    },
    [transformation, zoomContainerRef, svgOffset, setNodes]
  )

  return <rect onMouseDown={onMouseDown} className={CLASSES.DISCONNECTOR} style={disconnectorStyle(position)} />
}

export default React.memo(ArrowDisconnector, isEqual)
