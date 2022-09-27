import React, { useContext, useEffect, useMemo } from "react"
import { isEqual, omit } from "lodash"
import { Node as NodeType } from "@/types"
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
> = ({ node, nodeInteractions, nodeComponentProps, recalculateRects }) => {
  const { nodeRepresentation: NodeComponent } = useContext(EditorContext)

  return (
    <div
      id={node.id}
      className="node"
      onMouseDown={nodeInteractions.onDragStarted}
      onMouseUp={nodeInteractions.onMouseUp}
      style={nodeStyle(node.position)}
      onMouseEnter={nodeInteractions.onMouseEnter}
      onMouseLeave={nodeInteractions.onMouseLeave}
    >
      {node.outputs.map((out) => (
        <Point key={out.id} node={node} output={out} />
      ))}
      <NodeComponent onSizeChanged={recalculateRects} {...nodeComponentProps} />
    </div>
  )
}

export default React.memo(Provider, isEqual)
