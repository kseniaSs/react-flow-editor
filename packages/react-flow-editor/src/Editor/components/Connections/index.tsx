import React, { useEffect } from "react"
import { useStore } from "@nanostores/react"

import { ConnectionsAtom, NodesAtom, SvgOffsetAtom, SVGOffsetState, TransformationMap } from "@/Editor/state"
import { Node, Point } from "@/types"

import { Connection } from "./components/Connection"
import { NewConnection } from "./components/NewConnection"
import { computeNodeGroupsRect, connectionContainerStyle, getOffsettedPosition } from "./helpers"
import { Arrow } from "./components/Arrow"
import { useEditorContext } from "../../editor-context"

const getNodeWithSelectedConnection = ({
  node,
  selectedConnection,
  svgOffset
}: {
  node: Node
  selectedConnection: Array<[Point, Point] | []>
  svgOffset: SVGOffsetState
}) => {
  const [selected, hovered] = selectedConnection

  const filtredOutputs = node.outputs.filter((out) => {
    const { x: offsettedXPosition, y: offsettedYPosition } = getOffsettedPosition({ node, output: out, svgOffset })

    return !(
      (!!selected.length && offsettedXPosition === selected[1].x && offsettedYPosition === selected[1].y) ||
      (!!hovered.length && offsettedXPosition === hovered[1].x && offsettedYPosition === hovered[1].y)
    )
  })

  if (node.outputs.length !== filtredOutputs.length) {
    return node
  }

  return undefined
}

export const Container: React.FC = () => {
  const svgOffset = SvgOffsetAtom.get()

  const { selectedConnection, hoveredConnection } = useStore(ConnectionsAtom)

  const { connectorStyleConfig } = useEditorContext()
  const nodes = useStore(NodesAtom)
  const transformation = useStore(TransformationMap)

  const nodesRect = computeNodeGroupsRect(nodes, transformation)

  useEffect(() => {
    SvgOffsetAtom.set({
      x: nodesRect.leftPoint,
      y: nodesRect.topPoint,
      width: nodesRect.realWidth,
      height: nodesRect.realHeight
    })
  }, [nodesRect.leftPoint, nodesRect.topPoint, nodesRect.realHeight, nodesRect.realWidth])

  const nodesWithSelectedConnection: Array<Node> = nodes
    .map((node) =>
      getNodeWithSelectedConnection({
        node,
        svgOffset,
        selectedConnection: [selectedConnection, hoveredConnection]
      })
    )
    .filter((node): node is Node => !!node)

  return (
    <div className="con">
      {!!nodesWithSelectedConnection.length && (
        <svg className="connections connections--with-selected" style={connectionContainerStyle(nodesRect)}>
          <Arrow color={connectorStyleConfig?.color} />
          {nodesWithSelectedConnection.map((node) => (
            <Connection key={node.id} node={node} />
          ))}
          <NewConnection />
        </svg>
      )}
      <svg className="connections" style={connectionContainerStyle(nodesRect)}>
        <Arrow color={connectorStyleConfig?.color} />
        {nodes.map((node) => (
          <Connection key={node.id} node={node} />
        ))}
        <NewConnection />
      </svg>
    </div>
  )
}
