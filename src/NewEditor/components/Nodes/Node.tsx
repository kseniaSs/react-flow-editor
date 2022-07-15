import React, { useEffect } from "react"
import classNames from "classnames"
import { useRecoilState, useSetRecoilState } from "recoil"

import { Vector2d } from "../../../geometry"
import { Node as NodeType } from "../../../types"
import { BUTTON_LEFT } from "../../constants"
import { selectedNodeState, newConnectionState, draggableNodeState, nodesState, dragItem } from "../../ducks/store"
import { resetEvent } from "../../helpers"

const nodeStyle = (pos: Vector2d) => ({
  transform: `translate(${pos.x}px, ${pos.y}px)`
})

type NodeProps = {
  node: NodeType
}

type PointProps = {
  node: NodeType
}

const Point: React.FC<PointProps> = ({ node }) => {
  const setSelectedNode = useSetRecoilState(selectedNodeState)
  const setTypeDragItem = useSetRecoilState(dragItem)

  const setNode = (e: React.MouseEvent<HTMLElement>) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      setSelectedNode(node.id)
      setTypeDragItem("connection")
    }
  }

  return <div className="dot input right" onMouseDown={setNode} />
}

const Node: React.FC<NodeProps> = ({ node }) => {
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState)
  const setDraggableNode = useSetRecoilState(draggableNodeState)
  const setNodes = useSetRecoilState(nodesState)

  const nodeClassNames = classNames("node", node.classNames || [], { selected: selectedNode === node.id })

  useEffect(() => {
    const rectPosition = document.getElementById(node.id).getClientRects()[0]

    setNodes((nodes) =>
      nodes.map((currentNode) => (currentNode.id === node.id ? { ...currentNode, rectPosition } : currentNode))
    )
  }, [node.id])

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === BUTTON_LEFT) {
      setDraggableNode(node.id)
    }
  }

  const onNodeClick: React.MouseEventHandler<HTMLDivElement> = () => {
    setSelectedNode(selectedNode === node.id ? undefined : node.id)
  }

  return (
    <div
      id={node.id}
      onClick={onNodeClick}
      onMouseDown={onDragStarted}
      style={nodeStyle(node.position)}
      className={nodeClassNames}
    >
      {node.children}
      <Point node={node} />
    </div>
  )
}

export default Node
