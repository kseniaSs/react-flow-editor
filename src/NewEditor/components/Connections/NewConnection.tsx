import React from "react"
import { useRecoilValue } from "recoil"
import InputConnection from "./InputConnection"
import {
  dotSizeState,
  newConnectionState,
  nodesState,
  offsetState,
  pointPositionState,
  selectedNodeState,
  zoomState
} from "../../ducks/store"

export const NewConnection: React.FC = () => {
  const newConnectionPosition = useRecoilValue(newConnectionState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const nodes = useRecoilValue(nodesState)
  const pointPosition = useRecoilValue(pointPositionState)
  const dotSize = useRecoilValue(dotSizeState)
  const zoom = useRecoilValue(zoomState)

  if (!newConnectionPosition || !selectedNodeId) return null

  const outputNode = nodes.find((node) => node.id === selectedNodeId)

  const outputPosition = outputNode.rectPosition
    ? {
        x: outputNode.position.x + (outputNode.rectPosition?.width || 0) / zoom.zoom + pointPosition.x,
        y:
          outputNode.position.y +
          (outputNode.rectPosition?.height || 0) / zoom.zoom +
          pointPosition.y -
          (dotSize?.width || 0) / 2
      }
    : outputNode.position

  return (
    <InputConnection
      key={`${selectedNodeId}_new`}
      outputPosition={newConnectionPosition}
      inputPosition={outputPosition}
    />
  )
}
