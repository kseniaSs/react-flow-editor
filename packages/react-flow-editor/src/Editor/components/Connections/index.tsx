import React, { useContext, useEffect } from "react"
import { NodesAtom, SvgOffsetAtom, TransformationAtom } from "@/Editor/state"
import { useStore } from "@nanostores/react"

import { Connection } from "./components/Connection"
import { NewConnection } from "./components/NewConnection"
import { computeNodeGroupsRect, connectionContainerStyle } from "./helpers"
import { Arrow } from "./components/Arrow"
import { EditorContext } from "../../context"

export const Container: React.FC = () => {
  const { styleConfig } = useContext(EditorContext)
  const nodes = useStore(NodesAtom)
  const transformation = useStore(TransformationAtom)

  const nodesRect = computeNodeGroupsRect(nodes, transformation)

  useEffect(() => {
    SvgOffsetAtom.set({
      x: nodesRect.leftPoint,
      y: nodesRect.topPoint,
      width: nodesRect.realWidth,
      height: nodesRect.realHeight
    })
  }, [nodesRect.leftPoint, nodesRect.topPoint, nodesRect.realHeight, nodesRect.realWidth])

  return (
    <svg className="connections" style={connectionContainerStyle(nodesRect)}>
      <Arrow color={styleConfig?.connector?.color} />
      {nodes.map((node) => (
        <Connection key={node.id} node={node} />
      ))}
      <NewConnection />
    </svg>
  )
}
