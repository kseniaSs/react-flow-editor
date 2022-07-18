import React from "react"
import { useRecoilValue } from "recoil"
import InputConnection from "./InputConnection"
import { Node as NodeType } from "../../../types"
import { Point } from "../../types"
import { nodesState } from "../../ducks/store"

type ConnectionProps = {
  node: NodeType
  pointPosition: Point
}

export const Connection: React.FC<ConnectionProps> = (props) => {
  const nodes = useRecoilValue(nodesState)
  const { node } = props

  return (
    <>
      {node.input.map((inputConnection) => {
        const outputNode = nodes.find((node) => node.id === inputConnection)

        if (!outputNode) return null

        return (
          <InputConnection
            pointPosition={props.pointPosition}
            key={`${node.id}_${inputConnection}`}
            outputPosition={outputNode.position}
            inputPosition={node.position}
          />
        )
      })}
    </>
  )
}
