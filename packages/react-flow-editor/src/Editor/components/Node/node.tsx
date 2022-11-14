import React, { useContext, useEffect } from "react"
import { isEqual } from "lodash"
import { Node as NodeType } from "@/types"
import { nodeStyle } from "./helpers"
import { Point } from "./Point"
import { useNodeInteractions } from "./useNodeInteractions"
import { EditorContext } from "../../context"

type NodeProps = {
  node: NodeType
}

export const Provider = ({ node }: NodeProps) => {
  const { setNodes } = useContext(EditorContext)

  useEffect(() => {
    const nodeElement = document.getElementById(node.id)

    if (nodeElement)
      setNodes((nodes) =>
        nodes.map((currentNode) =>
          currentNode.id === node.id
            ? { ...currentNode, rectPosition: nodeElement.getBoundingClientRect() }
            : currentNode
        )
      )
  }, [node.id])

  const nodeInteractions = useNodeInteractions(node)

  return <Node node={node} nodeInteractions={nodeInteractions} />
}

const Node: React.FC<
  NodeProps & {
    nodeInteractions: ReturnType<typeof useNodeInteractions>
  }
> = ({ node, nodeInteractions }) => {
  const { NodeComponent } = useContext(EditorContext)

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
      <NodeComponent {...node} />
    </div>
  )
}

export default React.memo(Provider, isEqual)
