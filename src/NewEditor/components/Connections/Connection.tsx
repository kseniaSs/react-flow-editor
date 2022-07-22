import React from "react"
import { useRecoilValue } from "recoil"
import InputConnection from "./InputConnection"
import { Node as NodeType } from "../../../types"
import { Point, Offset } from "../../types"
import { nodesState } from "../../ducks/store"

type ConnectionProps = {
  node: NodeType
  pointPosition: Point
  offset: Offset
}

export const Connection: React.FC<ConnectionProps> = (props) => {
  const nodes = useRecoilValue(nodesState)
  const { node } = props

  return (
    <>
      {node.input.map((inputConnection) => {
        const outputNode = nodes.find((node) => node.id === inputConnection)

        if (!outputNode) return null

        const inputPosition = node.rectPosition
          ? {
              x: node.rectPosition.right - props.offset.offsetLeft + props.pointPosition.x,
              y: node.rectPosition.bottom - props.offset.offsetTop + props.pointPosition.y
            }
          : node.position

        const outputPosition = {
          x: outputNode.position.x,
          y: outputNode.position.y + (node.rectPosition?.height || 0) / 2
        }

        return (
          <InputConnection
            pointPosition={props.pointPosition}
            key={`${node.id}_${inputConnection}`}
            outputPosition={outputPosition}
            inputPosition={inputPosition}
          />
        )
      })}
    </>
  )
}
