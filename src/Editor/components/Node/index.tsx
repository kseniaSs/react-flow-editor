import React, { useContext, useEffect } from "react"
import { useSetRecoilState } from "recoil"
import { isEqual, omit } from "lodash"
import { Node as NodeType } from "../../../types"
import { BUTTON_LEFT, CLASSES } from "../../constants"
import { dragItemState, hoveredNodeIdState } from "../../ducks/store"
import { resetEvent, useRecalculateRects } from "../../helpers"
import { ItemType } from "../../types"
import { EditorContext } from "../../Editor"
import { nodeStyle } from "./helpers"
import { Point } from "./Point"

type NodeProps = {
  node: NodeType
}

const Node: React.FC<NodeProps> = ({ node }) => {
  const { setNodes } = useContext(EditorContext)
  const setDragItem = useSetRecoilState(dragItemState)
  const setHoveredNodeId = useSetRecoilState(hoveredNodeIdState)
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

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = (e) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      setDragItem({ type: ItemType.node, x: e.clientX, y: e.clientY })
    }

    setNodes((nodes) =>
      nodes.map((nodeItem) => ({
        ...nodeItem,
        isSelected: nodeItem.id === node.id || (e.shiftKey ? nodeItem.isSelected : false)
      }))
    )
  }

  const NodeComponent = node.children

  return (
    <div
      id={node.id}
      className={CLASSES.NODE}
      onMouseDown={onDragStarted}
      style={nodeStyle(node.position)}
      onMouseEnter={() => setHoveredNodeId(node.id)}
      onMouseLeave={() => setHoveredNodeId(null)}
    >
      <Point nodeId={node.id} />
      <NodeComponent onSizeChanged={recalculateRects} {...omit(node, ["children"])} />
    </div>
  )
}

export default React.memo(Node, isEqual)
