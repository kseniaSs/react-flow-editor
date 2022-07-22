import React from "react"
import { useRecoilValue } from "recoil"
import InputConnection from "./InputConnection"
import { Node as NodeType } from "../../../types"
import { dotSizeState, nodesState, offsetState, pointPositionState, zoomState } from "../../ducks/store"

type ConnectionProps = {
  node: NodeType
}

export const Connection: React.FC<ConnectionProps> = ({ node }) => {
  const nodes = useRecoilValue(nodesState)
  const pointPosition = useRecoilValue(pointPositionState)
  const offset = useRecoilValue(offsetState)
  const dotSize = useRecoilValue(dotSizeState)
  const zoom = useRecoilValue(zoomState)

  return (
    <>
      {node.input.map((inputConnection) => {
        const outputNode = nodes.find((node) => node.id === inputConnection)

        if (!outputNode) return null

        const inputPosition = node.rectPosition
          ? {
              x:
                node.rectPosition.left -
                offset.offsetLeft +
                pointPosition.x -
                (dotSize?.width || 0) / 2 +
                (node.rectPosition?.width || 0) -
                zoom.dx,
              y: node.rectPosition.bottom - offset.offsetTop + pointPosition.y - (dotSize?.height || 0) / 2 - zoom.dy
            }
          : node.position

        const outputPosition = {
          x: outputNode.position.x + pointPosition.x,
          y: outputNode.position.y + pointPosition.y - (dotSize?.height || 0) / 2 + (node.rectPosition?.height || 0)
        }

        return (
          <InputConnection
            key={`${node.id}_${inputConnection}`}
            outputPosition={outputPosition}
            inputPosition={inputPosition}
          />
        )
      })}
    </>
  )
}
