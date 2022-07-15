import React from "react"
import { useRecoilValue } from "recoil"
import { newConnectionState, nodesState, selectedNodeState } from "../../ducks/store"
import { InputConnection } from "./InputConnection"

type NewConnectionProps = {}

export const NewConnection: React.FC<NewConnectionProps> = () => {
  const newConnectionPosition = useRecoilValue(newConnectionState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const nodes = useRecoilValue(nodesState)

  if (!newConnectionPosition || !selectedNodeId) return null

  const outputNode = nodes.find((node) => node.id === selectedNodeId)

  return (
    <InputConnection
      key={`${selectedNodeId}_new`}
      outputPosition={outputNode.position}
      inputPosition={newConnectionPosition}
    />
  )
}
