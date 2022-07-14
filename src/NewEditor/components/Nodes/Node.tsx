import React from "react"
import classNames from "classnames"
import { useRecoilState, useSetRecoilState } from "recoil"

import { Vector2d } from "../../../geometry"
import { Node as NodeType } from "../../../types"
import { BUTTON_LEFT } from "../../constants"
import { selectedNodeState, newConnectionState, draggableNodeState } from "../../ducks/store"

const nodeStyle = (pos: Vector2d) => ({
  top: `${pos.y}px`,
  left: `${pos.x}px`
})

type NodeProps = {
  node: NodeType
}

type PointProps = {
  node: NodeType
}

const Point: React.FC<PointProps> = ({ node }) => {
  const setNewConnectionState = useSetRecoilState(newConnectionState)

  const setNode = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    e.preventDefault()
    console.log("set node")
    setNewConnectionState(node)
  }

  return <div className="dot input right" onClick={setNode} />
}

const Node: React.FC<NodeProps> = ({ node }) => {
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState)
  const [draggableNode, setDraggableNode] = useRecoilState(draggableNodeState)

  const nodeClassNames = classNames("node", node.classNames || [], { selected: selectedNode === node.id })

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === BUTTON_LEFT && draggableNode !== node.id) {
      setDraggableNode(node.id)
    }
  }

  const onNodeClick: React.MouseEventHandler<HTMLDivElement> = () => {
    setSelectedNode(selectedNode === node.id ? undefined : node.id)
  }

  return (
    <div onClick={onNodeClick} onMouseDown={onDragStarted} style={nodeStyle(node.position)} className={nodeClassNames}>
      {node.children}
      <Point node={node} />
    </div>
  )
}

export default Node
