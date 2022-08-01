import React, { useContext } from "react"
import { useRecoilValue } from "recoil"
import { Node } from "../../../../types"
import { DEFAULT_POINT_SIZE } from "../../../constants"
import { svgOffsetState } from "../../../ducks/store"
import { EditorContext } from "../../../Editor"
import InputConnection from "./InputConnection"

type ConnectionProps = {
  node: Node
}

export const Connection: React.FC<ConnectionProps> = ({ node }) => {
  const { nodes, transformation, styleConfig } = useContext(EditorContext)

  const svgOffset = useRecoilValue(svgOffsetState)

  return (
    <>
      {node.next.map((nextNodeId) => {
        const nextNode = nodes.find((node) => node.id === nextNodeId)

        if (!nextNode) return null

        const inputPosition = node.rectPosition
          ? {
              x:
                -svgOffset.x +
                node.position.x -
                (node?.outputPosition?.x || 0) -
                (styleConfig?.point?.width || DEFAULT_POINT_SIZE) / 2 +
                (node.rectPosition?.width || 0) / transformation.zoom,
              y:
                -svgOffset.y +
                node.position.y -
                (node?.outputPosition?.y || 0) -
                (styleConfig?.point?.height || DEFAULT_POINT_SIZE) / 2 +
                (node.rectPosition?.height || 0) / transformation.zoom
            }
          : node.position

        const outputPosition = {
          x: -svgOffset.x + nextNode.position.x + (node?.inputPosition?.x || 0),
          y:
            -svgOffset.y +
            nextNode.position.y +
            (nextNode.rectPosition?.height || 0) / transformation.zoom +
            (node?.inputPosition?.y || 0)
        }

        return <InputConnection key={nextNodeId} outputPosition={outputPosition} inputPosition={inputPosition} />
      })}
    </>
  )
}
