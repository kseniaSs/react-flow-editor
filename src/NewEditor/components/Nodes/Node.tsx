import React from "react"
import classNames from "classnames"
import { Vector2d } from "../../../geometry"
import { Node as NodeType } from "../../../types"
import { BUTTON_LEFT } from "../../constants"
import { useSetRecoilState } from "recoil"
import { selectedNodeState, newConnectionState } from "../../ducks/store"

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
    console.log('set node')
    setNewConnectionState(node)
  }

  return <div className="dot input right" onClick={setNode}/>
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
      <Point node={node} />
    </div>
  )
}

export default Node
