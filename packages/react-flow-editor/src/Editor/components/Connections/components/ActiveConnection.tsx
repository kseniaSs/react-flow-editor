import React from "react"
import { useStore } from "@nanostores/react"

import { Node, Output } from "@/types"
import { HoveredConnectionAtom, NodesAtom, SelectedConnectionAtom, SvgOffsetAtom } from "@/Editor/state"

import ArrowDisconnector from "./ArrowDisconnector"
import InputConnection from "./InputConnection"
import { getOffsettedPosition } from "../helpers"

type ConnectionProps = {
  node: Node
}

export const ConnectionTrack: React.FC<{ output: Output; node: Node }> = ({ output, node }) => {
  const nodes = useStore(NodesAtom)
  const svgOffset = useStore(SvgOffsetAtom)

  const nextNode = nodes.find((node) => node.id === output.nextNodeId)

  if (!nextNode) return null

  const outputPosition = {
    x: -svgOffset.x + node.position.x + output.position.x,
    y: -svgOffset.y + node.position.y + output.position.y
  }

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

export const ActiveConnection: React.FC<ConnectionProps> = ({ node }) => {
  const svgOffset = useStore(SvgOffsetAtom)
  const [selectedConnection, hoveredConnection] = [useStore(SelectedConnectionAtom), useStore(HoveredConnectionAtom)]

  const filteredConnections = node.outputs.filter((out) => {
    const { x, y } = getOffsettedPosition({ position: out, node, svgOffset })

    return (
      (x === selectedConnection[0]?.x && y === selectedConnection[0].y) ||
      (x === hoveredConnection[0]?.x && y === hoveredConnection[0].y) ||
      (x === selectedConnection[1]?.x && y === selectedConnection[1].y) ||
      (x === hoveredConnection[1]?.x && y === hoveredConnection[1].y)
    )
  })

  return (
    <>
      {filteredConnections.map((out) => (
        <ConnectionTrack key={out.id} node={node} output={out} />
      ))}
    </>
  )
}
