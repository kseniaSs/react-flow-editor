import React, { useContext } from "react"
import { useStore } from "@nanostores/react"

import { Node, Output } from "@/types"
import { DEFAULT_POINT_SIZE } from "@/Editor/constants"
import { EditorContext } from "@/Editor/context"
import { DragItemType } from "@/Editor/types"
import { DragItemAtom, NodesAtom, SvgOffsetAtom } from "@/Editor/state"

import ArrowDisconnector from "./ArrowDisconnector"
import InputConnection from "./InputConnection"

type ConnectionProps = {
  node: Node
}

export const ConnectionTrack: React.FC<{ output: Output; node: Node }> = ({ output, node }) => {
  const { connectorStyleConfig } = useContext(EditorContext)
  const nodes = useStore(NodesAtom)
  const svgOffset = useStore(SvgOffsetAtom)

  const nextNode = nodes.find((node) => node.id === output.nextNodeId)

  if (!nextNode) return null

  const outputPosition = node.rectPosition
    ? {
        x: -svgOffset.x + node.position.x + output.position.x + (connectorStyleConfig?.width || DEFAULT_POINT_SIZE) / 2,
        y: -svgOffset.y + node.position.y + output.position.y + (connectorStyleConfig?.height || DEFAULT_POINT_SIZE) / 2
      }
    : node.position

  const inputPosition = nextNode && {
    x: -svgOffset.x + nextNode.position.x + (nextNode?.inputPosition?.x || 0),
    y: -svgOffset.y + nextNode.position.y + (nextNode?.inputPosition?.y || 0)
  }

  return (
    <React.Fragment key={output.id}>
      <InputConnection outputPosition={outputPosition} inputPosition={inputPosition} />
      <ArrowDisconnector position={inputPosition} output={output} fromId={node.id} />
    </React.Fragment>
  )
}

export const Connection: React.FC<ConnectionProps> = ({ node }) => {
  const dragItem = useStore(DragItemAtom)

  const filteredConnections = node.outputs.filter(
    (out) =>
      !(
        dragItem.type === DragItemType.connection &&
        out.nextNodeId === dragItem.output?.nextNodeId &&
        node.id === dragItem.id
      )
  )

  return (
    <>
      {filteredConnections.map((out) => (
        <ConnectionTrack key={out.id} node={node} output={out} />
      ))}
    </>
  )
}
