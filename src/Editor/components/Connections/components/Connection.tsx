import React, { useContext, useMemo } from "react"
import { useRecoilValue } from "recoil"
import { Node, Output } from "../../../../types"
import { DEFAULT_POINT_SIZE } from "../../../constants"
import { EditorContext } from "../../../context"
import { dragItemState, svgOffsetState } from "../../../ducks/store"
import { ItemType } from "../../../types"
import ArrowDisconnector from "./ArrowDisconnector"
import InputConnection from "./InputConnection"

type ConnectionProps = {
  node: Node
}

export const ConnectionTrack: React.FC<{ output: Output; node: Node }> = ({ output, node }) => {
  const { nodes, styleConfig } = useContext(EditorContext)
  const svgOffset = useRecoilValue(svgOffsetState)
  const nextNode = nodes.find((node) => node.id === output.nextNodeId)

  const outputPosition = useMemo(
    () =>
      node.rectPosition
        ? {
            x:
              -svgOffset.x +
              node.position.x +
              output.position.x +
              (styleConfig?.point?.width || DEFAULT_POINT_SIZE) / 2,
            y:
              -svgOffset.y +
              node.position.y +
              output.position.y +
              (styleConfig?.point?.height || DEFAULT_POINT_SIZE) / 2
          }
        : node.position,
    [node, svgOffset, styleConfig, output]
  )

  const inputPosition = useMemo(
    () =>
      nextNode && {
        x: -svgOffset.x + nextNode.position.x + (nextNode?.inputPosition?.x || 0),
        y: -svgOffset.y + nextNode.position.y + (nextNode?.inputPosition?.y || 0)
      },
    [svgOffset, nextNode]
  )

  if (!nextNode) return null

  return (
    <React.Fragment key={output.id}>
      <InputConnection outputPosition={outputPosition} inputPosition={inputPosition} />
      <ArrowDisconnector position={inputPosition} output={output} fromId={node.id} />
    </React.Fragment>
  )
}

export const Connection: React.FC<ConnectionProps> = ({ node }) => {
  const dragItem = useRecoilValue(dragItemState)

  const filteredConnections = useMemo(
    () =>
      node.outputs.filter(
        (out) =>
          !(
            dragItem.type === ItemType.connection &&
            out.nextNodeId === dragItem.output?.nextNodeId &&
            node.id === dragItem.id
          )
      ),
    [dragItem.type, node]
  )

  return (
    <>
      {filteredConnections.map((out) => (
        <ConnectionTrack key={out.id} node={node} output={out} />
      ))}
    </>
  )
}
