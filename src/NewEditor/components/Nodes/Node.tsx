import React from "react"
import classNames from "classnames"
import { Vector2d } from "../../../geometry"
import { Node as NodeType } from "../../../types"
import { BUTTON_LEFT } from "../../constants"
import { useSetRecoilState } from "recoil"
import { selectedNodeState } from "../../ducks/store"

const nodeStyle = (pos: Vector2d) => ({
  top: `${pos.y}px`,
  left: `${pos.x}px`
})

type NodeProps = {
  node: NodeType
}

const Node: React.FC<NodeProps> = ({ node }) => {
  const setSelectedNode = useSetRecoilState(selectedNodeState)

  const nodeClassNames = classNames("node", node.classNames || [])

  const onDragStarted = (node: NodeType, e: React.MouseEvent<HTMLElement>) => {
    if (e.button === BUTTON_LEFT) {
      setSelectedNode(node.id)
    }
  }

  return (
    <div onMouseDown={(e) => onDragStarted(node, e)} style={nodeStyle(node.position)} className={nodeClassNames}>
      {node.children}
    </div>
  )
}

export default Node
