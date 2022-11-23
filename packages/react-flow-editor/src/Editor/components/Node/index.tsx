import React from "react"
import { NodesAtom } from "@/Editor/state"
import { useStore } from "@nanostores/react"

import { Container as ConnectionContainer } from "../../components/Connections"
import Node from "./node"
import { isEqual } from "lodash"

export const NodesContainer: React.FC = React.memo(() => {
  const nodes = useStore(NodesAtom)

  return (
    <>
      {nodes.map((node) => (
        <Node node={node} key={node.id} />
      ))}
      <ConnectionContainer />
    </>
  )
}, isEqual)
