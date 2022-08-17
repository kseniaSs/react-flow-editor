import React, { useContext, useEffect } from "react"
import { Connection } from "./components/Connection"
import { NewConnection } from "./components/NewConnection"
import { svgOffsetState } from "../../ducks/store"
import { useSetRecoilState } from "recoil"
import { computeNodeGroupsRect, connectionContainerStyle } from "./helpers"
import { Arrow } from "./components/Arrow"
import { CLASSES } from "../../constants"
import { EditorContext } from "../../context"

export const Container: React.FC = () => {
  const { transformation, nodes, styleConfig } = useContext(EditorContext)

  const setSvgOffsetState = useSetRecoilState(svgOffsetState)
  const nodesRect = computeNodeGroupsRect(nodes, transformation)

  useEffect(() => {
    setSvgOffsetState({
      x: nodesRect.leftPoint,
      y: nodesRect.topPoint,
      width: nodesRect.realWidth,
      height: nodesRect.realHeight
    })
  }, [nodesRect.leftPoint, nodesRect.topPoint, nodesRect.realHeight, nodesRect.realWidth])

  return (
    <svg className={CLASSES.CONNECTIONS} style={connectionContainerStyle(nodesRect)}>
      <Arrow color={styleConfig?.connector?.color} />
      {nodes.map((node) => (
        <Connection key={node.id} node={node} />
      ))}
      <NewConnection />
    </svg>
  )
}
