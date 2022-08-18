import React, { useEffect, useContext } from "react"
import { Container as ConnectionContainer } from "../../components/Connections"
import { useRecalculateRects } from "../../helpers"
import Node from "./node"
import { isEqual } from "lodash"
import { EditorContext } from "../../context"

export const NodesContainer: React.FC = React.memo(() => {
  const { nodes, transformation } = useContext(EditorContext)

  const recalculateRects = useRecalculateRects()

  useEffect(() => {
    if (!nodes.length) return

    recalculateRects()
  }, [transformation.zoom])

  return (
    <>
      {nodes.map((node) => (
        <Node node={node} key={node.id} />
      ))}
      <ConnectionContainer />
    </>
  )
}, isEqual)
