import React from "react"
import { useRecoilValue } from "recoil"
import { Node as NodeType, Connection as ConnectionType } from "../../../types"
import { nodesState } from "../../ducks/store"

type ConnectionProps = {
  node: NodeType
}

type InputConnectionProps = {
  connection: ConnectionType
  inputNode: NodeType
}

const InputConnection: React.FC<InputConnectionProps> = ({ inputNode, connection }) => {
  const nodes = useRecoilValue(nodesState)

  console.log("connection", connection)

  const outputNode = nodes.find((node) => node.id === connection.nodeId)

  if (!outputNode) return null

  const outputPosition = outputNode.position
  const inputPosition = inputNode.position

  const dx = Math.max(Math.abs(outputPosition.x - inputPosition.x) / 1.5, 100)
  const a1 = { x: outputPosition.x - dx, y: outputPosition.y }
  const a2 = { x: inputPosition.x + dx, y: inputPosition.y }

  // https://javascript.info/bezier-curve
  const cmd = `M ${outputPosition.x} ${outputPosition.y} C ${a1.x} ${a1.y}, ${a2.x} ${a2.y}, ${inputPosition.x} ${inputPosition.y}`

  // just line, will be when we add props connectionType
  // cmd = `M ${outputPosition.x} ${outputPosition.y} L ${inputPosition.x} ${inputPosition.y}`

  return <path className="connection" d={cmd} markerStart="url(#triangle)" />
}

// TODO: Change to props
const Arrow: React.FC = () => (
  <defs>
    <marker
      id="triangle"
      viewBox="0 0 10 10"
      refX="0"
      refY="5"
      markerUnits="strokeWidth"
      markerWidth="10"
      markerHeight="8"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z"></path>
    </marker>
  </defs>
)

export const Connection: React.FC<ConnectionProps> = (props) => {
  const { node } = props

  return (
    <>
      <Arrow />
      {node.input.map((inputConnection) => (
        <InputConnection key={`${node.id}_${inputConnection.nodeId}`} inputNode={node} connection={inputConnection} />
      ))}
    </>
  )
}
