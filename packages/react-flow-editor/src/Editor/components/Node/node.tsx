import React, { useEffect } from "react"
import { isEqual } from "lodash"

import { Node as NodeType } from "@/types"
import { nodeActions } from "@/Editor/state"

import { nodeStyle } from "./helpers"
import { useNodeInteractions } from "./useNodeInteractions"
import { useEditorContext } from "../../editor-context"
import { Output } from "../Output"

type NodeProps = {
  node: NodeType
}

export const Provider = ({ node }: NodeProps) => {
  useEffect(() => {
    const nodeElement = document.getElementById(node.id)

    if (nodeElement) {
      nodeActions.changeNodeRectPos(node.id, nodeElement.getBoundingClientRect())
    }
  }, [node.id])

  const nodeInteractions = useNodeInteractions(node)

  return <Node node={node} nodeInteractions={nodeInteractions} />
}

const Node: React.FC<
  NodeProps & {
    nodeInteractions: ReturnType<typeof useNodeInteractions>
  }
> = ({ node, nodeInteractions }) => {
  const { NodeComponent } = useEditorContext()

  return (
    <div
      id={node.id}
      className="node"
      onMouseDown={nodeInteractions.onDragStarted}
      onMouseUp={nodeInteractions.onMouseUp}
      style={nodeStyle(node.position, node.state)}
      onMouseEnter={nodeInteractions.onMouseEnter}
      onMouseLeave={nodeInteractions.onMouseLeave}
    >
      {node.outputs.map((out) => (
        <Output key={out.id} node={node} output={out} />
      ))}
      <NodeComponent {...node} />
    </div>
  )
}

export default React.memo(Provider, isEqual)
