import React, { useContext } from "react"
import { useRecoilValue } from "recoil"
import { Node } from "../../../../types"
import { dotSizeState, svgOffsetState } from "../../../ducks/store"
import { EditorContext } from "../../../Editor"
import InputConnection from "./InputConnection"

type ConnectionProps = {
  node: Node
}

export const Connection: React.FC<ConnectionProps> = ({ node }) => {
  const { nodes, transformation } = useContext(EditorContext)

  const dotSize = useRecoilValue(dotSizeState)
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
                node.outputPosition.x -
                (dotSize?.width || 0) / 2 +
                (node.rectPosition?.width || 0) / transformation.zoom,
              y:
                -svgOffset.y +
                node.position.y -
                node.outputPosition.y -
                (dotSize?.height || 0) / 2 +
                (node.rectPosition?.height || 0) / transformation.zoom
            }
          : node.position

        const outputPosition = {
          x: -svgOffset.x + nextNode.position.x + node.inputPosition.x,
          y:
            -svgOffset.y +
            nextNode.position.y +
            (nextNode.rectPosition?.height || 0) / transformation.zoom +
            node.inputPosition.y
        }

        return <InputConnection key={nextNodeId} outputPosition={outputPosition} inputPosition={inputPosition} />
      })}
    </>
  )
}
