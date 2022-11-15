import React, { useCallback, useContext } from "react"
import { useSetRecoilState } from "recoil"
import { NodeState, Output, Point } from "@/types"
import { ItemType } from "@/Editor/types"
import { EditorContext, RectsContext } from "@/Editor/context"
import { dragItemState } from "@/Editor/ducks/store"
import { disconnectorStyle } from "../helpers"
import { NewConnectionAtom, nodeActions, SvgOffsetAtom } from "@/Editor/state"
import { useStore } from "@nanostores/react"

type DisconnectorProps = {
  position: Point
  fromId: string
  output: Output
}

const ArrowDisconnector: React.FC<DisconnectorProps> = ({ position, fromId, output }) => {
  const { zoomContainerRef } = useContext(RectsContext)
  const { transformation } = useContext(EditorContext)
  const svgOffset = useStore(SvgOffsetAtom)

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

      NewConnectionAtom.set(newPos)

      nodeActions.changeNodeState(fromId, NodeState.draggingConnector)
    },
    [transformation, zoomContainerRef, svgOffset]
  )

  return <rect onMouseDown={onMouseDown} className="disconnector" style={disconnectorStyle(position)} />
}

export default ArrowDisconnector
