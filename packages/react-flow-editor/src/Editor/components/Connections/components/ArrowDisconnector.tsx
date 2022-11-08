import React, { useCallback, useContext } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { NodeState, Output, Point } from "@/types"
import { ItemType } from "@/Editor/types"
import { EditorContext, RectsContext } from "@/Editor/context"
import { dragItemState, newConnectionState, svgOffsetState } from "@/Editor/ducks/store"
import { disconnectorStyle } from "../helpers"

type DisconnectorProps = {
  position: Point
  fromId: string
  output: Output
}

const ArrowDisconnector: React.FC<DisconnectorProps> = ({ position, fromId, output }) => {
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
        id: fromId,
        output,
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

  return <rect onMouseDown={onMouseDown} className="disconnector" style={disconnectorStyle(position)} />
}

export default ArrowDisconnector