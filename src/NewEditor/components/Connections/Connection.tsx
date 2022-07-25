import React from "react"
import { useRecoilValue } from "recoil"
import InputConnection from "./InputConnection"
import { Node as NodeType } from "../../../types"
import { dotSizeState, nodesState, pointPositionState, zoomState } from "../../ducks/store"

type ConnectionProps = {
  node: NodeType
}

export const Connection: React.FC<ConnectionProps> = ({ node }) => {
  const nodes = useRecoilValue(nodesState)
  const pointPosition = useRecoilValue(pointPositionState)
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
                node.position.x +
                pointPosition.x -
                (dotSize?.width || 0) / 2 +
                (node.rectPosition?.width || 0) / zoom.zoom,
              y:
                node.position.y +
                pointPosition.y -
                (dotSize?.height || 0) / 2 +
                (node.rectPosition?.height || 0) / zoom.zoom
            }
          : node.position

        const outputPosition = {
          x: outputNode.position.x + pointPosition.x,
          y:
            outputNode.position.y +
            pointPosition.y -
            (dotSize?.height || 0) / 2 +
            (outputNode.rectPosition?.height || 0) / zoom.zoom
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
