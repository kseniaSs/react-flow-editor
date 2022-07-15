import React from "react"
import { useRecoilValue } from "recoil"
import { InputConnection } from "./InputConnection"
import { Node as NodeType } from "../../../types"
import { nodesState } from "../../ducks/store"

type ConnectionProps = {
  node: NodeType
}

export const Connection: React.FC<ConnectionProps> = (props) => {
  const nodes = useRecoilValue(nodesState)
  const { node } = props

  return (
    <>
      {node.input.map((inputConnection) => {
        const outputNode = nodes.find((node) => node.id === inputConnection.nodeId)

        if (!outputNode) return null

        return (
          <InputConnection
            key={`${node.id}_${inputConnection.nodeId}`}
            outputPosition={outputNode.position}
            inputPosition={node.position}
          />
        )
      })}
    </>
  )
}
