import React from "react"
import Node from "./Node"
import { useRecoilValue } from "recoil"
import { nodesState } from "../../ducks/store"

export const NodeContainer: React.FC = () => {
  const nodes = useRecoilValue(nodesState)

  return (
    <>
      {nodes.map((node) => (
        <Node node={node} key={node.id} />
      ))}
    </>
  )
}
