import React, { useContext, useEffect, useMemo } from "react"
import { isEqual, omit } from "lodash"
import { Node as NodeType } from "../../../types"
import { CLASSES } from "../../constants"
import { useRecalculateRects } from "../../helpers"
import { nodeStyle } from "./helpers"
import { Point } from "./Point"
import { useNodeInteractions } from "./useNodeInteractions"
import { EditorContext } from "../../context"

type NodeProps = {
  node: NodeType
}

export const Provider = ({ node }: NodeProps) => {
  const { setNodes } = useContext(EditorContext)
  const recalculateRects = useRecalculateRects()

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((currentNode) =>
        currentNode.id === node.id
          ? { ...currentNode, rectPosition: document.getElementById(node.id).getBoundingClientRect() }
          : currentNode
      )
    )
  }, [node.id])

  const nodeInteractions = useNodeInteractions(node)
  const nodeComponentProps = useMemo(() => omit(node, ["children"]), [node])

  return (
    <Node
      node={node}
      nodeInteractions={nodeInteractions}
      nodeComponentProps={nodeComponentProps}
      recalculateRects={recalculateRects}
    />
  )
}

const Node: React.FC<
  NodeProps & {
    nodeInteractions: ReturnType<typeof useNodeInteractions>
    nodeComponentProps: Omit<NodeType, "children">
    recalculateRects: ReturnType<typeof useRecalculateRects>
  }
> = React.memo(({ node, nodeInteractions, nodeComponentProps, recalculateRects }) => {
  const NodeComponent = node.children

  return (
    <div
      id={node.id}
      className={CLASSES.NODE}
      onMouseDown={nodeInteractions.onDragStarted}
      onMouseUp={nodeInteractions.onMouseUp}
      style={nodeStyle(node.position)}
      onMouseEnter={nodeInteractions.onMouseEnter}
      onMouseLeave={nodeInteractions.onMouseLeave}
    >
      {node.next.concat(node.outputNumber > node.next.length ? [null] : []).map((nextId) => (
        <Point key={nextId} nodeId={node.id} nextId={nextId} />
      ))}
      <NodeComponent onSizeChanged={recalculateRects} {...nodeComponentProps} />
    </div>
  )
}, isEqual)

export default React.memo(Provider, isEqual)
