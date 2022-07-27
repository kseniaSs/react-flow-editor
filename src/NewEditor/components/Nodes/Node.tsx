import React, { useEffect } from "react"
import classNames from "classnames"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import _ from "lodash"

import { Vector2d } from "../../../geometry"
import { Node as NodeType } from "../../../types"
import { ItemType, Point as PointType } from "../../types"
import { BUTTON_LEFT } from "../../constants"
import {
  nodesState,
  dragItemState,
  pointPositionState,
  newConnectionState,
  zoomState,
  svgOffsetState,
  hoveredNodeIdState
} from "../../ducks/store"
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
  const setDragItem = useSetRecoilState(dragItemState)
  const pointPosition = useRecoilValue(pointPositionState)
  const [stateNodes, setStateNodes] = useRecoilState(nodesState)
  const setNewConnectionState = useSetRecoilState(newConnectionState)
  const transformation = useRecoilValue(zoomState)
  const svgOffset = useRecoilValue(svgOffsetState)

  const setNode = (e: React.MouseEvent<HTMLElement>) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      const currentNode = stateNodes.find((node) => node.id === nodeId)

      setStateNodes((nodes) =>
        nodes.map((node) =>
          node.id === currentNode.id ? { ...node, isSelected: true } : { ...node, isSelected: false }
        )
      )

      const pos = {
        x:
          -svgOffset.x +
          currentNode.position.x -
          pointPosition.x +
          currentNode.rectPosition.width / transformation.zoom,
        y:
          -svgOffset.y +
          currentNode.position.y -
          pointPosition.y +
          currentNode.rectPosition.height / transformation.zoom
      }

      setNewConnectionState(pos)

      setDragItem({
        type: ItemType.connection,
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  return <div id={`dot-${nodeId}`} className="dot input" style={pointStyle(pointPosition)} onMouseDown={setNode} />
}

const Node: React.FC<NodeProps> = ({ node }) => {
  const setDragItem = useSetRecoilState(dragItemState)
  const setStateNodes = useSetRecoilState(nodesState)
  const setHoveredNodeId = useSetRecoilState(hoveredNodeIdState)

  const nodeClassNames = classNames("node", node.classNames || [], { selected: node.isSelected })

  useEffect(() => {
    const rectPosition = document.getElementById(node.id).getClientRects()[0]

    setStateNodes((nodes) =>
      nodes.map((currentNode) => (currentNode.id === node.id ? { ...currentNode, rectPosition } : currentNode))
    )
  }, [node.id])

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = (e) => {
    resetEvent(e)
    if (e.button === BUTTON_LEFT) {
      setDragItem({ type: ItemType.node, x: e.clientX, y: e.clientY })
    }

    setStateNodes((nodes) =>
      nodes.map((nodeItem) =>
        nodeItem.id === node.id
          ? { ...nodeItem, isSelected: true }
          : { ...nodeItem, isSelected: e.ctrlKey || e.metaKey ? nodeItem.isSelected : false }
      )
    )
  }

  return (
    <div
      id={node.id}
      onMouseDown={onDragStarted}
      style={nodeStyle(node.position)}
      className={nodeClassNames}
      onMouseEnter={() => setHoveredNodeId(node.id)}
      onMouseLeave={() => setHoveredNodeId(null)}
    >
      <Point nodeId={node.id} />
      {node.children}
    </div>
  )
}

export default React.memo(Node, _.isEqual)
