import React from "react"
import { Connection } from "./Connection"
import { NewConnection } from "./NewConnection"
import { useNodeGroupsRect } from "../../helpers"
import { nodesState } from "../../ducks/store"
import { useRecoilValue } from "recoil"

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
        d="M0.646447 0.646446C0.84171 0.451184 1.15829 0.451185 1.35355 0.646447L5.35355 4.64646C5.44732 4.74023 5.5 4.86741 5.5 5.00002C5.5 5.13263 5.44732 5.2598 5.35355 5.35357L1.35355 9.35355C1.15829 9.54882 0.841708 9.54881 0.646446 9.35355C0.451184 9.15829 0.451185 8.84171 0.646447 8.64645L4.29289 5.00002L0.646446 1.35355C0.451184 1.15829 0.451185 0.841708 0.646447 0.646446Z"
        fill="#3C7BE1"
      />
    </marker>
  </defs>
)

export const Container: React.FC = () => {
  const nodes = useRecoilValue(nodesState)
  const { leftPoint, topPoint, realHeight, realWidth } = useNodeGroupsRect()

  const connectionContainerStyle: React.CSSProperties = {
    pointerEvents: "none",
    minWidth: realWidth,
    minHeight: realHeight,
    transform: `translate(${leftPoint}px, ${topPoint}px)`
  }

  return (
    <svg className="connections" xmlns="http://www.w3.org/2000/svg" style={connectionContainerStyle}>
      <Arrow />
      {nodes.map((node) => (
        <Connection key={`${node.id}-connection`} node={node} svgOffset={{ x: leftPoint, y: topPoint }} />
      ))}
      <NewConnection svgOffset={{ x: leftPoint, y: topPoint, width: realWidth, height: realHeight }} />
    </svg>
  )
}
