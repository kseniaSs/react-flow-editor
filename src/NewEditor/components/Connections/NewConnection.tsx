import React from "react"
import { useRecoilValue } from "recoil"
import { newConnectionState, nodesState, selectedNodeState } from "../../ducks/store"
import { InputConnection } from "./InputConnection"
import { Point } from "../../types"

type NewConnectionProps = {
  pointPosition: Point
}

export const NewConnection: React.FC<NewConnectionProps> = ({ pointPosition }) => {
  const newConnectionPosition = useRecoilValue(newConnectionState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const nodes = useRecoilValue(nodesState)

  if (!newConnectionPosition || !selectedNodeId) return null

  const outputNode = nodes.find((node) => node.id === selectedNodeId)

  return (
    <InputConnection
      key={`${selectedNodeId}_new`}
      pointPosition={pointPosition}
      outputPosition={newConnectionPosition}
      inputPosition={outputNode.position}
    />
  )
}
