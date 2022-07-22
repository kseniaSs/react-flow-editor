import React from "react"
import { useRecoilValue } from "recoil"
import InputConnection from "./InputConnection"
import { newConnectionState, nodesState, selectedNodeState } from "../../ducks/store"
import { Offset, Point } from "../../types"

type NewConnectionProps = {
  pointPosition: Point
  offset: Offset
}

export const NewConnection: React.FC<NewConnectionProps> = ({ pointPosition, offset }) => {
  const newConnectionPosition = useRecoilValue(newConnectionState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const nodes = useRecoilValue(nodesState)

  if (!newConnectionPosition || !selectedNodeId) return null

  const outputNode = nodes.find((node) => node.id === selectedNodeId)

  const outputPosition = outputNode.rectPosition
    ? {
        x: outputNode.rectPosition.right - offset.offsetLeft + pointPosition.x,
        y: outputNode.rectPosition.bottom - offset.offsetTop + pointPosition.y
      }
    : outputNode.position

  return (
    <InputConnection
      key={`${selectedNodeId}_new`}
      pointPosition={pointPosition}
      outputPosition={newConnectionPosition}
      inputPosition={outputPosition}
    />
  )
}
