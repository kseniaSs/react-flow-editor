import React from "react"
import { useRecoilValue } from "recoil"
import InputConnection from "./InputConnection"
import { Node as NodeType } from "../../../types"
import {
  dotSizeState,
  inputPositionState,
  nodesState,
  pointPositionState,
  svgOffsetState,
  zoomState
} from "../../ducks/store"

type ConnectionProps = {
  node: NodeType
}

export const Connection: React.FC<ConnectionProps> = ({ node }) => {
  const nodes = useRecoilValue(nodesState)
  const pointPosition = useRecoilValue(pointPositionState)
  const inputStatePosition = useRecoilValue(inputPositionState)
  const dotSize = useRecoilValue(dotSizeState)
  const zoom = useRecoilValue(zoomState)
  const svgOffset = useRecoilValue(svgOffsetState)

  return (
    <>
      {node.input.map((inputConnection) => {
        const outputNode = nodes.find((node) => node.id === inputConnection)

        if (!outputNode) return null

        const inputPosition = node.rectPosition
          ? {
              x:
                -svgOffset.x +
                node.position.x -
                pointPosition.x -
                (dotSize?.width || 0) / 2 +
                (node.rectPosition?.width || 0) / zoom.zoom,
              y:
                -svgOffset.y +
                node.position.y -
                pointPosition.y -
                (dotSize?.height || 0) / 2 +
                (node.rectPosition?.height || 0) / zoom.zoom
            }
          : node.position

        const outputPosition = {
          x: -svgOffset.x + outputNode.position.x + inputStatePosition.x,
          y:
            -svgOffset.y +
            outputNode.position.y +
            (outputNode.rectPosition?.height || 0) / zoom.zoom +
            inputStatePosition.y
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
