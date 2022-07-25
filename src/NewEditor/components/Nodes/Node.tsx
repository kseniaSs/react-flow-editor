import React, { useEffect } from "react"
import classNames from "classnames"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import _ from "lodash"

import { Vector2d } from "../../../geometry"
import { Node as NodeType } from "../../../types"
import { Point as PointType } from "../../types"
import { BUTTON_LEFT } from "../../constants"
import { selectedNodeState, draggableNodeState, nodesState, dragItemState, pointPositionState } from "../../ducks/store"
import { resetEvent } from "../../helpers"

const nodeStyle = (pos: Vector2d) => ({
  transform: `translate(${pos.x}px, ${pos.y}px)`
})

const pointStyle = (position: PointType): React.CSSProperties => ({
  bottom: `${position.y}px`,
  right: `${position.x}px`
})

type NodeProps = {
  node: NodeType
}

type PointProps = {
  nodeId: string
}

const Point: React.FC<PointProps> = ({ nodeId }) => {
  const setSelectedNode = useSetRecoilState(selectedNodeState)
  const setDragItem = useSetRecoilState(dragItemState)
  const pointPosition = useRecoilValue(pointPositionState)

  const setNode = (e: React.MouseEvent<HTMLElement>) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      setSelectedNode(nodeId)
      setDragItem({ type: "connection", x: e.clientX, y: e.clientY })
    }
  }

  return <div id={`dot-${nodeId}`} className="dot input" style={pointStyle(pointPosition)} onMouseDown={setNode} />
}

const Node: React.FC<NodeProps> = ({ node }) => {
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
      setDragItem({ type: "node", x: e.clientX, y: e.clientY })
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
      <Point nodeId={node.id} />
      {node.children}
    </div>
  )
}

export default React.memo(Node, _.isEqual)
