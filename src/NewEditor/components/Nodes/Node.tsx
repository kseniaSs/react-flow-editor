import React, { useEffect } from "react"
import classNames from "classnames"
import { useRecoilState, useSetRecoilState } from "recoil"

import { resetEvent } from "../../helpers"
import { Vector2d } from "../../../geometry"
import { Node as NodeType } from "../../../types"
import { BUTTON_LEFT } from "../../constants"
import { selectedNodeState, dragItem, nodesState } from "../../ducks/store"

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
  const [nodes, setNodes] = useRecoilState(nodesState)
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState)
  const setDragItem = useSetRecoilState(dragItem)

  const nodeClassNames = classNames("node", node.classNames || [])

  useEffect(() => {
    const rectPosition = document.getElementById(node.id).getClientRects()[0]
    const setterNode = nodes.map((currentNode) =>
      currentNode.id === node.id ? { ...currentNode, rectPosition } : currentNode
    )
    console.log("49", setterNode, node.id, rectPosition)
    setNodes(setterNode)
  }, [node.id])

  const onDragStarted = (node: NodeType, e: React.MouseEvent<HTMLElement>) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT && selectedNode !== node.id) {
      setSelectedNode(node.id)
      setDragItem("node")
    }
  }

  return (
    <div style={nodeStyle(node.position)} className={nodeClassNames} id={node.id}>
      <div onMouseDown={(e) => onDragStarted(node, e)}>{node.children}</div>
      <Point node={node} />
    </div>
  )
}

export default Node
