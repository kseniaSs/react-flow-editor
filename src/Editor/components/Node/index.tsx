import React, { useContext, useEffect } from "react"
import { isEqual, omit } from "lodash"
import { Node as NodeType } from "../../../types"
import { CLASSES } from "../../constants"
import { useRecalculateRects } from "../../helpers"
import { EditorContext } from "../../Editor"
import { nodeStyle } from "./helpers"
import { Point } from "./Point"
import { useNodeInteractions } from "./useNodeInteractions"

type NodeProps = {
  node: NodeType
}

const Node: React.FC<NodeProps> = ({ node }) => {
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

  const { onDragStarted, onMouseUp, onMouseEnter, onMouseLeave, onMouseMove } = useNodeInteractions(node)

  const NodeComponent = node.children

  return (
    <div
      id={node.id}
      className={CLASSES.NODE}
      onMouseDown={onDragStarted}
      onMouseUp={onMouseUp}
      style={nodeStyle(node.position)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {node.next.concat(node.outputNumber > node.next.length ? [null] : []).map((nextId) => (
        <Point key={nextId} nodeId={node.id} nextId={nextId} />
      ))}
      <NodeComponent onSizeChanged={recalculateRects} {...omit(node, ["children"])} />
    </div>
  )
}

export default React.memo(Node, isEqual)
