import React, { useState } from "react"
import Node from "./Node"
import { useRecoilValue } from "recoil"
import { nodesState } from "../../ducks/store"

type Transformation = {
  dx: number
  dy: number
  zoom: number
}

const useNodeHooks = () => {
  const [transformation, setTransformation] = useState<Transformation>({ dx: 0, dy: 0, zoom: 1 })

  return { transformation, setTransformation }
}

export const NodeContainer: React.FC = () => {
  const nodes = useRecoilValue(nodesState)

  return (
    <div>
      {nodes.map((node) => (
        <Node node={node} key={node.id} />
      ))}
    </div>
  )
}
