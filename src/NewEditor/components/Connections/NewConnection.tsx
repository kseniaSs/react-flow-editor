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
  const offset = useRecoilValue(offsetState)
  const dotSize = useRecoilValue(dotSizeState)
  const zoom = useRecoilValue(zoomState)

  if (!newConnectionPosition || !selectedNodeId) return null

  const outputNode = nodes.find((node) => node.id === selectedNodeId)

  const outputPosition = outputNode.rectPosition
    ? {
        x: outputNode.rectPosition.right - offset.offsetLeft + pointPosition.x - zoom.dx,
        y: outputNode.rectPosition.bottom - offset.offsetTop + pointPosition.y - (dotSize?.width || 0) / 2 - zoom.dy
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
