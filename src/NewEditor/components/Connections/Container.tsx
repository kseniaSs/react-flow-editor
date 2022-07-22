import React from "react"
import { Connection } from "./Connection"
import { useRecoilValue } from "recoil"
import { nodesState } from "../../ducks/store"
import { NewConnection } from "./NewConnection"
import { Point, Offset } from "../../types"

type ContainerProps = {
  pointPosition: Point
  offset: Offset
}

// TODO: Change to props
const Arrow: React.FC = () => (
  <defs>
    <marker
      id="triangle"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      preserveAspectRatio="none"
      markerUnits="strokeWidth"
      markerWidth="10"
      markerHeight="8"
      stroke="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.292896 0.29289C0.683422 -0.0976324 1.31659 -0.0976297 1.70711 0.292896L5.20674 3.79256C5.59727 4.18309 5.59726 4.81625 5.20674 5.20677L1.70711 8.7064C1.31658 9.09693 0.683417 9.09693 0.292893 8.7064C-0.0976311 8.31588 -0.0976311 7.68272 0.292893 7.29219L3.08542 4.49966L0.29289 1.7071C-0.0976324 1.31658 -0.0976297 0.683413 0.292896 0.29289Z"
        fill="#3C7BE1"
      />
    </marker>
  </defs>
)

export const Container: React.FC<ContainerProps> = ({ pointPosition, offset }) => {
  const nodes = useRecoilValue(nodesState)

  const connectionContainerStyle: React.CSSProperties = {
    pointerEvents: "none"
  }

  return (
    <svg className="connections" xmlns="http://www.w3.org/2000/svg" style={connectionContainerStyle}>
      <Arrow />
      {nodes.map((node) => (
        <Connection pointPosition={pointPosition} key={`${node.id}-connection`} offset={offset} node={node} />
      ))}
      <NewConnection pointPosition={pointPosition} offset={offset} />
    </svg>
  )
}
