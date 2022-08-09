import React, { useContext, useMemo } from "react"
import { useRecoilValue } from "recoil"
import { Node } from "../../../../types"
import { DEFAULT_POINT_SIZE } from "../../../constants"
import { dragItemState, svgOffsetState } from "../../../ducks/store"
import { EditorContext } from "../../../Editor"
import { ItemType } from "../../../types"
import ArrowDisconnector from "./ArrowDisconnector"
import InputConnection from "./InputConnection"

type ConnectionProps = {
  node: Node
}

export const ConnectionTrack: React.FC<{ nextNodeId: string; node: Node; inx: number }> = ({
  nextNodeId,
  node,
  inx
}) => {
  const { nodes, styleConfig } = useContext(EditorContext)
  const svgOffset = useRecoilValue(svgOffsetState)
  const nextNode = nodes.find((node) => node.id === nextNodeId)

  if (!nextNode) return null

  const inputPosition = useMemo(
    () =>
      node.rectPosition
        ? {
            x:
              -svgOffset.x +
              node.position.x +
              (node.outputPosition[inx]?.x || 0) +
              (styleConfig?.point?.width || DEFAULT_POINT_SIZE) / 2,
            y:
              -svgOffset.y +
              node.position.y +
              (node.outputPosition[inx]?.y || 0) +
              (styleConfig?.point?.height || DEFAULT_POINT_SIZE) / 2
          }
        : node.position,
    [node, svgOffset, styleConfig]
  )

  const outputPosition = useMemo(
    () => ({
      x: -svgOffset.x + nextNode.position.x + (nextNode?.inputPosition?.x || 0),
      y: -svgOffset.y + nextNode.position.y + (nextNode?.inputPosition?.y || 0)
    }),
    [svgOffset, nextNode]
  )

  return (
    <React.Fragment key={nextNodeId}>
      <InputConnection key={nextNodeId} outputPosition={outputPosition} inputPosition={inputPosition} />
      <ArrowDisconnector position={outputPosition} nextId={nextNodeId} fromId={node.id} />
    </React.Fragment>
  )
}

export const Connection: React.FC<ConnectionProps> = ({ node }) => {
  const dragItem = useRecoilValue(dragItemState)

  const filteredConnections = useMemo(
    () =>
      node.next.filter(
        (id) => !(dragItem.type === ItemType.connection && id === dragItem.nextId && node.id === dragItem.fromId)
      ),
    [dragItem.type]
  )

  return (
    <>
      {filteredConnections.map((nextNodeId, inx) => (
        <ConnectionTrack key={nextNodeId} node={node} nextNodeId={nextNodeId} inx={inx} />
      ))}
    </>
  )
}
