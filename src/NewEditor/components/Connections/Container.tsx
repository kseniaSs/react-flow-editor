import React from "react"
import { Connection } from "./Connection"
import { useRecoilValue } from "recoil"
import { nodesState } from "../../ducks/store"
import { NewConnection } from "./NewConnection"
import { Point } from "../../types"

type ContainerProps = {
  pointPosition: Point
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

export const Container: React.FC<ContainerProps> = ({ pointPosition }) => {
  const nodes = useRecoilValue(nodesState)

  const connectionContainerStyle: React.CSSProperties = {
    pointerEvents: "none"
  }

  return (
    <svg className="connections" xmlns="http://www.w3.org/2000/svg" style={connectionContainerStyle}>
      <Arrow />
      {nodes.map((node) => (
        <Connection pointPosition={pointPosition} key={`${node.id}-connection`} node={node} />
      ))}
      <NewConnection pointPosition={pointPosition} />
    </svg>
  )
}
