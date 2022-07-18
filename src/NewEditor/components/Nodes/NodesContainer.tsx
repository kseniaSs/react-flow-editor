import React from "react"
import Node from "./Node"
import { useRecoilValue } from "recoil"
import { nodesState } from "../../ducks/store"

export const NodeContainer: React.FC<{ pointPosition: { x: number; y: number } }> = ({ pointPosition }) => {
  const nodes = useRecoilValue(nodesState)

  return (
    <div>
      {nodes.map((node) => (
        <Node node={node} position={pointPosition} key={node.id} />
      ))}
    </div>
  )
}
