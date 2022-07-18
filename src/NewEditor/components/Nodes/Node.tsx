import React, { useEffect } from "react"
import classNames from "classnames"
import { useRecoilState, useSetRecoilState } from "recoil"

import { Vector2d } from "../../../geometry"
import { Node as NodeType } from "../../../types"
import { Point as PointType } from "../../types"
import { BUTTON_LEFT } from "../../constants"
import { selectedNodeState, newConnectionState, draggableNodeState, nodesState, dragItemState } from "../../ducks/store"
import { resetEvent } from "../../helpers"

const nodeStyle = (pos: Vector2d) => ({
  transform: `translate(${pos.x}px, ${pos.y}px)`
})

const pointStyle = (position: Vector2d) => ({
  top: `${position.x}px`,
  left: `${position.y}px`,
  position: "relative"
})

type NodeProps = {
  node: NodeType
  position: PointType
}

type PointProps = {
  node: NodeType
  position: PointType
}

const Point: React.FC<PointProps> = ({ node, position }) => {
  const setSelectedNode = useSetRecoilState(selectedNodeState)
  const setDragItem = useSetRecoilState(dragItemState)

  const setNode = (e: React.MouseEvent<HTMLElement>) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      setSelectedNode(node.id)
      setDragItem("connection")
    }
  }

  return <div className="dot input right" style={pointStyle(position)} onMouseDown={setNode} />
}

const Node: React.FC<NodeProps> = ({ node, position }) => {
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState)
  const setDraggableNode = useSetRecoilState(draggableNodeState)
  const setDragItem = useSetRecoilState(dragItemState)
  const setNodes = useSetRecoilState(nodesState)

  const nodeClassNames = classNames("node", node.classNames || [], { selected: selectedNode === node.id })

  useEffect(() => {
    const rectPosition = document.getElementById(node.id).getClientRects()[0]

    setNodes((nodes) =>
      nodes.map((currentNode) => (currentNode.id === node.id ? { ...currentNode, rectPosition } : currentNode))
    )
  }, [node.id])

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = (e) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      setDraggableNode(node.id)
      setDragItem("node")
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
      <Point node={node} position={position} />
    </div>
  )
}

export default Node
